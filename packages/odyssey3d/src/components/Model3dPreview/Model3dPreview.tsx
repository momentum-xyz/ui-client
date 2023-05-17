// ignore all typescript error in this file
import {FC, useEffect, useRef, useState} from 'react';
import {
  AssetContainer,
  Scene,
  SceneLoader,
  Vector3,
  Color4,
  InstantiatedEntries
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import SceneComponent from 'babylonjs-hook';
import cn from 'classnames';

import * as styled from './Model3dPreview.styled';

export interface Model3dPreviewPropsInterface {
  filename: string;
  delayLoadingMsec?: number;
  background?: boolean;
  previewUrl?: string;
  onSnapshot?: (dataUrl: string, initial: boolean) => void;
  onAssetInfoLoaded?: (data: any) => void;
  // onAssetInfoLoaded?: (data: GLTF['asset']) => void;
}

export const Model3dPreview: FC<Model3dPreviewPropsInterface> = ({
  filename,
  background = true,
  delayLoadingMsec,
  previewUrl,
  onSnapshot,
  onAssetInfoLoaded
}) => {
  console.log('Model3dPreview', {
    filename,
    background,
    delayLoadingMsec,
    previewUrl,
    onSnapshot,
    onAssetInfoLoaded
  });

  const refCanvas = useRef<HTMLCanvasElement | null>(null);
  const refScene = useRef<Scene>();
  const refAssetContainer = useRef<AssetContainer>();
  const refInstance = useRef<InstantiatedEntries>();

  const [progress, setProgress] = useState<number | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDelayingLoading, setIsDelayingLoading] = useState(!!delayLoadingMsec);
  const onSnapshotRef = useRef(onSnapshot);
  onSnapshotRef.current = onSnapshot;

  useEffect(() => {
    if (!delayLoadingMsec) {
      return;
    }
    const timeout = setTimeout(() => {
      setIsDelayingLoading(false);
    }, delayLoadingMsec);
    return () => {
      clearTimeout(timeout);
    };
  }, [delayLoadingMsec, filename]);

  useEffect(() => {
    return () => {
      console.log('Model3dPreview unmounting');
      const scene = refScene.current;
      if (scene) {
        scene.dispose();
      }
    };
  }, []);

  const onSceneReady = (scene: Scene) => {
    console.log('onSceneReady', scene, scene.getEngine());
    refScene.current = scene;

    scene.clearColor = new Color4(0, 0, 0, 0); // Set to transparent background

    scene.createDefaultCameraOrLight(true, true, true);

    SceneLoader.LoadAssetContainerAsync(
      filename,
      '',
      scene,
      (progress) => {
        // On progress callback
        console.log(`Loading progress ${progress.loaded}/${progress.total}`);
        setProgress(Math.ceil((progress.loaded / progress.total) * 100));
      },
      '.glb'
    )
      .then((container) => {
        console.log('container', container);
        refAssetContainer.current = container;
        // container.addAllToScene();
        const instance = container.instantiateModelsToScene();
        console.log('instance', instance);
        refInstance.current = instance;

        scene.createDefaultCameraOrLight(true, true, true);

        const {min, max} = scene.getWorldExtends();
        const center = min.add(max).scale(0.5);
        const size = max.subtract(min).length();
        console.log('Loaded object sizes', {min, max, center, size});

        if (scene.activeCamera) {
          scene.activeCamera.position = center.add(new Vector3(0, 0, size * 1.5));
          // scene.activeCamera.position = center.add(new Vector3(size / 2.0, size / 2.0, size * 1.5));
        }
        // Adding all cameras to the scene
        // container.cameras.forEach((camera) => {
        //   scene.addCamera(camera);
        // });

        for (const group of instance.animationGroups) {
          group.play(true);
        }

        setIsModelLoaded(true);
        setProgress(null);
      })
      .catch((err) => {
        console.log('Error loading model asset', err);
      });
  };

  const onRender = (scene: Scene) => {
    const node = refInstance.current?.rootNodes[0];
    if (node) {
      // console.log('onRender', node);
      node.rotation.y += 0.1;
    }
  };

  return (
    <styled.Container>
      {progress !== null && (
        <styled.ProgressBarHolder style={{zIndex: 3}}>
          {/* <ProgressBar percent={progress} /> */}
          <div>...{progress}%</div>
        </styled.ProgressBarHolder>
      )}
      {!isModelLoaded && (
        <styled.NestedContainer style={{zIndex: 2}}>
          <styled.Canvas
            ref={refCanvas}
            className={cn({background})}
            previewUrl={!isModelLoaded ? previewUrl : undefined}
            style={{width: '100%', height: '100%'}}
          />
        </styled.NestedContainer>
      )}

      {!isDelayingLoading && (
        <styled.NestedContainer style={{zIndex: 1}}>
          <SceneComponent
            id="babylon-canvas"
            antialias
            onSceneReady={onSceneReady}
            onRender={onRender}
            style={{width: '100%', height: '100%'}}
          />
        </styled.NestedContainer>
      )}

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
