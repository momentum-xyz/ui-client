import {FC} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';

import {Odyssey3dPropsInterface} from '../../core/interfaces';
import {CameraHelper, LightHelper, ObjectHelper, SkyboxHelper} from '../../babylon';
import {WorldCreatorHelper} from '../../babylon/WorldCreatorHelper';

const BabylonScene: FC<Odyssey3dPropsInterface> = ({
  events,
  onObjectClick,
  onUserClick,
  onMove
}) => {
  /* Will run one time. */
  const onSceneReady = (scene: Scene) => {
    const view = scene.getEngine().getRenderingCanvas();
    const engine = scene.getEngine();
    if (view?.id) {
      CameraHelper.initialize(scene, view);
      LightHelper.initialize(scene);
      ObjectHelper.initialize(
        scene,
        engine,
        //  props.objects,
        view
        // onObjectClick,
        // onUserClick,
        // onMove,
      );
      WorldCreatorHelper.initialize(scene);
      //SkyboxHelper.setCubemapSkybox(scene);
      SkyboxHelper.set360Skybox(
        scene,
        'https://dev2.odyssey.ninja/api/v3/render/texture/s8/26485e74acb29223ba7a9fa600d36c7f'
      );

      if (window.sessionStorage.getItem('babylon_debug')) {
        Promise.all([
          import('@babylonjs/core/Debug/debugLayer'),
          import('@babylonjs/inspector')
        ]).then(() => {
          scene.debugLayer.show({overlay: true});
        });
      }

      events.on('SetWorld', (assetID) => {
        // Commented out the actual line, as currently the assetID coming from BE is a Unity asset, so doesn't load
        //CameraHelper.spawnPlayer(scene, assetID);
        CameraHelper.spawnPlayer(scene, 'd906e070-3d2e-b1a5-3e3f-703423225945');
      });

      events.on('ObjectCreated', async (object) => {
        await ObjectHelper.spawnObjectAsync(scene, object);
      });

      events.on('ObjectTextureChanged', (object) => {
        ObjectHelper.setObjectTexture(scene, object);
      });
    } else {
      console.error('There is no canvas for Babylon.');
    }
  };

  /* Will run on every frame render. It is useful for animations */
  const onRender = (scene: Scene) => {
    // console.log(scene.getEngine().getDeltaTime());
  };

  return (
    <div data-testid="Babylon-scene">
      <SceneComponent
        id="babylon-canvas"
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        style={{width: '100vw', height: '100vh'}}
      />
    </div>
  );
};

export default BabylonScene;
