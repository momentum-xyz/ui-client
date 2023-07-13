import {FC, useEffect, useRef, useState} from 'react';
import {ProgressBar} from '@momentum-xyz/ui-kit';
import {
  Scene,
  SceneLoader,
  Vector3,
  Color4,
  InstantiatedEntries,
  ArcRotateCamera,
  Tools
} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import cn from 'classnames';

import '../../babylon/initLoaderGLTF';

import * as styled from './Model3dPreview.styled';

export interface Model3dPreviewPropsInterface {
  filename: string;
  delayLoadingMsec?: number;
  background?: boolean;
  previewUrl?: string;
  onSnapshot?: (dataUrl: string, initial: boolean) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onAssetInfoLoaded?: (data: any) => void; // it seems not greatly supported in babylon
}

export const Model3dPreview: FC<Model3dPreviewPropsInterface> = ({
  filename,
  background = true,
  delayLoadingMsec,
  previewUrl,
  onSnapshot
}) => {
  const refScene = useRef<Scene>();
  const refInstance = useRef<InstantiatedEntries>();

  const [progress, setProgress] = useState<number | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDelayingLoading, setIsDelayingLoading] = useState(!!delayLoadingMsec);

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
      const scene = refScene.current;
      if (scene) {
        console.log('Model3dPreview unmounting');
        scene.dispose();
      }
    };
  }, []);

  const onSceneReady = (scene: Scene) => {
    // console.log('onSceneReady', scene, scene.getEngine());
    refScene.current = scene;

    scene.clearColor = new Color4(0, 0, 0, 0); // Set to transparent background

    scene.createDefaultCameraOrLight(true, true, true);

    SceneLoader.LoadAssetContainerAsync(
      filename,
      '',
      scene,
      (progress) => {
        setProgress(Math.ceil((progress.loaded / progress.total) * 100));
      },
      '.glb'
    )
      .then((container) => {
        console.log('Model3dPreview container', container);
        // container.addAllToScene();
        const instance = container.instantiateModelsToScene();
        console.log('Model3dPreview instance', instance);
        refInstance.current = instance;

        scene.createDefaultCameraOrLight(true, true, true);

        const {min, max} = scene.getWorldExtends();
        const center = min.add(max).scale(0.5);
        const size = max.subtract(min).length();

        if (scene.activeCamera instanceof ArcRotateCamera) {
          scene.activeCamera.position = center.add(new Vector3(0, size / 2.0, size * 1.5));
          scene.activeCamera.alpha += Math.PI / 4;
        }

        setTimeout(() => {
          if (onSnapshot) {
            Tools.CreateScreenshot(scene.getEngine(), scene.cameras[0], {precision: 1}, (data) => {
              fetch(data).then((base64Response) => {
                onSnapshot(base64Response.url, true);
              });
            });
          }

          for (const group of instance.animationGroups) {
            group.play(true);
          }
        }, 100);

        setIsModelLoaded(true);
      })
      .catch((err) => {
        console.log('Model3dPreview: Error loading model asset', err);
        setIsError(true);
      })
      .finally(() => {
        setProgress(null);
      });
  };

  const onRender = (scene: Scene) => {
    const node = refInstance.current?.rootNodes[0];
    if (node) {
      // console.log('onRender', node);
      // node.rotation.y += 0.1;
    }
    if (scene.activeCamera instanceof ArcRotateCamera) {
      scene.activeCamera.alpha -= 0.001;
      // TODO rotate object, not camera
    }
  };

  return (
    <styled.Container>
      {progress !== null && (
        <styled.ProgressBarHolder style={{zIndex: 3}}>
          <ProgressBar percent={progress} />
        </styled.ProgressBarHolder>
      )}
      {isError && <styled.Error>;-(</styled.Error>}
      {!isModelLoaded && (
        <styled.NestedContainer style={{zIndex: 2}}>
          <styled.Preview
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
            key={filename}
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
