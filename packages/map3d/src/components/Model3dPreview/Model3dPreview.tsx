import {useEffect, FC, useState, useRef} from 'react';
import {Scene, DirectionalLight, AmbientLight, WebGLRenderer, PerspectiveCamera} from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {ProgressBar} from '@momentum-xyz/ui-kit';

import * as styled from './Model3dPreview.styled';

const createScene = (canvas: HTMLCanvasElement) => {
  const renderer = new WebGLRenderer({
    canvas,
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
  controls.autoRotateSpeed = 10;
  controls.screenSpacePanning = true;

  return {
    scene,
    render: () => {
      renderer.render(scene, camera);
    }
  };
};

export interface PropsInterface {
  filename: string;
  background?: boolean;
}

export const Model3dPreview: FC<PropsInterface> = ({filename, background = true}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [progress, setProgress] = useState<number | null>(null);
  const [scene, setScene] = useState<Scene>();
  const renderRef = useRef<() => void>();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    if (scene) {
      return;
    }

    console.log('Creating scene');
    const {scene: _scene, render} = createScene(canvasRef.current);
    renderRef.current = render;
    setScene(_scene);
    renderRef.current();
  }, [scene]);

  useEffect(() => {
    if (!scene) {
      console.log('Scene not ready');
      return;
    }

    const loader = new GLTFLoader();

    console.log('Loading 3D model', filename);

    let _gltf: GLTF;

    const recursiveAnimate = () => {
      const render = renderRef.current;
      if (render) {
        render();
        requestAnimationFrame(recursiveAnimate);
      } else {
        console.log('Break recursive animation');
      }
    };

    setProgress(0);
    loader.load(
      filename,
      (gltf) => {
        console.log('Loaded 3D model', gltf);
        _gltf = gltf;
        if (loadedGltfRef.current) {
          scene.remove(loadedGltfRef.current.scene);
        }
        scene.add(gltf.scene);
        setProgress(null);

        recursiveAnimate();
      },
      (progress) => {
        console.log(progress);
        setProgress(Math.ceil((progress.loaded / progress.total) * 100));
      },
      (err) => {
        console.log('Error loading 3D model', err);
        setProgress(null);
      }
    );

    return () => {
      console.log('Clearing scene');
      if (_gltf) {
        scene.remove(_gltf.scene);
        renderRef.current = undefined;
      }
    };
  }, [scene, filename]);

  return (
    <styled.Container>
      {progress !== null && (
        <styled.ProgressBarHolder>
          <ProgressBar percent={progress} />
        </styled.ProgressBarHolder>
      )}
      <styled.Canvas
        className={cn({background})}
        style={{width: '100%', height: '100%'}}
        ref={canvasRef}
      />
      ;
    </styled.Container>
  );
};

export default Model3dPreview;
