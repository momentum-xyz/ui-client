import {FC} from 'react';
import {Scene} from '@babylonjs/core';
//import {Event3dEmitter} from '@momentum-xyz/core';
import SceneComponent from 'babylonjs-hook';
import {MsgType} from '@momentum-xyz/posbus-client';

import {Odyssey3dPropsInterface} from '../../core/interfaces';
import {CameraHelper, LightHelper, ObjectHelper} from '../../babylon';

import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF/2.0/glTFLoader';

const BabylonScene: FC<Odyssey3dPropsInterface> = (props) => {
  /* Will run one time. */
  const onSceneReady = (scene: Scene) => {
    const view = scene.getEngine().getRenderingCanvas();
    if (view?.id) {
      CameraHelper.initialize(scene, view);
      LightHelper.initialize(scene);
      ObjectHelper.initialize(scene, props.objects);

      scene.debugLayer.show({overlay: true});

      props.controllerPort.onmessage = (msg) => {
        const [msgType, data] = msg.data;
        console.debug(msgType, data);
        switch (msgType) {
          case MsgType.SET_WORLD:
            console.debug('Set world!');
            break;
          case MsgType.ADD_OBJECTS: {
            const objects = data.objects;
            ObjectHelper.addObjects(scene, objects);
            break;
          }
          default:
            console.debug('Unhandled message!');
        }
      };
      /*
      Event3dEmitter.on('ObjectCreated', (object) => {
        ObjectHelper.spawnObject(scene, object);
      });

      Event3dEmitter.on('ObjectTextureChanged', (object) => {
        ObjectHelper.setObjectTexture(scene, object);
      });
       */
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
