import {FC} from 'react';
import {Scene} from '@babylonjs/core';
import {Event3dEmitter} from '@momentum-xyz/core';
import SceneComponent from 'babylonjs-hook';

import {Odyssey3dPropsInterface} from '../../core/interfaces';
import {CameraHelper, LightHelper, ObjectHelper, SkyboxHelper} from '../../babylon';

// import '@babylonjs/core/Debug/debugLayer';
// import '@babylonjs/inspector';

const BabylonScene: FC<Odyssey3dPropsInterface> = (props) => {
  /* Will run one time. */
  const onSceneReady = (scene: Scene) => {
    const view = scene.getEngine().getRenderingCanvas();
    const engine = scene.getEngine();
    if (view?.id) {
      CameraHelper.initialize(scene, view);
      LightHelper.initialize(scene);
      ObjectHelper.initialize(scene, engine, props.objects, view);
      SkyboxHelper.setSkybox(scene);
      scene.debugLayer.show({overlay: true});

      Event3dEmitter.on('SetWorld', (assetID) => {
        CameraHelper.spawnPlayer(scene, assetID);
      });

      Event3dEmitter.on('ObjectCreated', (object) => {
        ObjectHelper.spawnObject(scene, object);
      });

      Event3dEmitter.on('ObjectTextureChanged', (object) => {
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
