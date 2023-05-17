import {useEffect, FC, useState, useRef, useCallback} from 'react';
import {
  Scene,
  DirectionalLight,
  AmbientLight,
  WebGLRenderer,
  PerspectiveCamera,
  Box3,
  Vector3
} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {ProgressBar} from '@momentum-xyz/ui-kit-storybook';
import cn from 'classnames';

import * as styled from './Model3dPreview.styled';

const loader = new GLTFLoader();

const promiseWait = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));

const createScene = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({
    canvas,
    preserveDrawingBuffer: true,
    antialias: true,
    alpha: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const scene = new Scene();

  const aspect = canvas.clientWidth / canvas.clientHeight;
  // console.log('Aspect', aspect);
  const camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.set(5, 5, 3);
  camera.lookAt(0, 0, 0);

  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 1);
  scene.add(light);

  const ambientLight = new AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1;
  controls.screenSpacePanning = true;

  controls.addEventListener('change', () => light.position.copy(camera.position));

  return {
    scene,
    autoPositionCamera: (gltf: GLTF) => {
      const object = gltf.scene;
      const box = new Box3().setFromObject(object);
      const size = box.getSize(new Vector3()).length();
      const center = box.getCenter(new Vector3());

      object.position.x += object.position.x - center.x;
      object.position.y += object.position.y - center.y;
      object.position.z += object.position.z - center.z;
      controls.maxDistance = size * 10;
      camera.near = size / 100;
      camera.far = size * 100;
      camera.updateProjectionMatrix();

      camera.position.copy(center);
      camera.position.x += size / 2.0;
      camera.position.y += size / 5.0;
      camera.position.z += size / 2.0;
      camera.lookAt(center);
    },
    render: () => {
      controls.update();
      light.position.copy(camera.position);
      renderer.render(scene, camera);
    },
    dispose: () => {
      console.log('Disposing renderer');
      controls.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    }
  };
};

export interface PropsInterface {
  filename: string;
  delayLoadingMsec?: number;
  background?: boolean;
  previewUrl?: string;
  onSnapshot?: (dataUrl: string, initial: boolean) => void;
  onAssetInfoLoaded?: (data: GLTF['asset']) => void;
}

export const Model3dPreview: FC<PropsInterface> = ({
  filename,
  background = true,
  delayLoadingMsec,
  previewUrl,
  onSnapshot,
  onAssetInfoLoaded
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [progress, setProgress] = useState<number | null>(null);
  const [scene, setScene] = useState<Scene>();
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const renderRef = useRef<() => void>();
  const disposeRef = useRef<() => void>();
  const autoPosRef = useRef<(gltf: GLTF) => void>();
  const loadedGltfRef = useRef<GLTF>();
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;

  const recursiveAnimate = useCallback(() => {
    const render = renderRef.current;
    if (render) {
      render();
      requestAnimationFrame(recursiveAnimate);
    } else {
      console.log('Break recursive animation');
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    if (scene) {
      return;
    }

    const init = async () => {
      if (delayLoadingMsec) {
        await promiseWait(delayLoadingMsec);
      }
      if (!canvasRef.current) {
        console.log('Canvas was unmounted');
        return;
      }

      console.log('Creating scene');
      const {scene: _scene, render, dispose, autoPositionCamera} = createScene(canvasRef.current);
      renderRef.current = render;
      disposeRef.current = dispose;
      autoPosRef.current = autoPositionCamera;

      setScene(_scene);

      recursiveAnimate();
    };

    init();
  }, [scene, recursiveAnimate, delayLoadingMsec]);

  useEffect(() => {
    if (!scene) {
      console.log('Scene not ready');
      return;
    }

    console.log('Loading 3D model', filename);

    // TODO uncomment this when all models can be loaded - for now the unity ones fail to load
    // and it leads to annoying blinking
    // setProgress(0);
    loader.load(
      filename,
      (gltf) => {
        console.log('Loaded 3D model', gltf);

        if (onAssetInfoLoaded) {
          onAssetInfoLoaded(gltf.asset);
        }

        loadedGltfRef.current = gltf;

        const autoPositionCamera = autoPosRef.current;
        if (autoPositionCamera) {
          autoPositionCamera(gltf);
        }

        scene.add(gltf.scene);

        setTimeout(() => {
          if (onSnapshotRef.current) {
            onSnapshotRef.current(canvasRef.current?.toDataURL('image/png') || '', true);
          }
        }, 100);

        setIsModelLoaded(true);
        setProgress(null);
      },
      (progress) => {
        // console.log(progress);
        setProgress(Math.ceil((progress.loaded / progress.total) * 100));
      },
      (err) => {
        console.log('Error loading 3D model', err);
        setProgress(null);
      }
    );

    return () => {
      console.log('Clearing scene');
      // FIXME unfortunately it doesn't work - if the filename is changing for this mode, it's better be remounted
      if (loadedGltfRef.current) {
        // scene.remove(loadedGltfRef.current.scene);
        console.log('Removing old model');
        loadedGltfRef.current.scene?.removeFromParent();
        renderRef.current?.();
      }
      renderRef.current = undefined;
    };
  }, [scene, filename]);

  useEffect(() => {
    return () => {
      disposeRef.current?.();
    };
  }, []);

  return (
    <styled.Container>
      {progress !== null && (
        <styled.ProgressBarHolder>
          <ProgressBar percent={progress} />
        </styled.ProgressBarHolder>
      )}
      <styled.Canvas
        className={cn({background})}
        previewUrl={!isModelLoaded ? previewUrl : undefined}
        style={{width: '100%', height: '100%'}}
        ref={canvasRef}
      />
      {/* TEMP disable it - we also need to remember orientation for the snapshot so it wouldn't be ugly moving from preview to model */}
      {/* {onSnapshot && (
        <styled.SnapshotButtonHolder title="Take snapshot">
          <IconSvg
            isWhite
            size="large"
            name="fullscreen"
            onClick={() => {
              // also possible to use toBlob
              const snapshot = canvasRef.current?.toDataURL();
              if (snapshot) {
                onSnapshot(snapshot, false);
              }
            }}
          />
        </styled.SnapshotButtonHolder>
      )} */}
    </styled.Container>
  );
};

export default Model3dPreview;
