import {FC, useEffect} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import {useMutableCallback} from '@momentum-xyz/ui-kit';

import {Odyssey3dPropsInterface} from '../../core/interfaces';
import {PlayerHelper, LightHelper, ObjectHelper, SkyboxHelper} from '../../babylon';
import {WorldCreatorHelper} from '../../babylon/WorldCreatorHelper';
import skyboxWorld from '../../static/PANOSKYGB.jpeg';
import {InteractionEffectHelper} from '../../babylon/InteractionEffectHelper';

const BabylonScene: FC<Odyssey3dPropsInterface> = ({events, ...callbacks}) => {
  const onObjectClick = useMutableCallback(callbacks.onObjectClick);
  const onUserClick = useMutableCallback(callbacks.onUserClick);
  const onMove = useMutableCallback(callbacks.onMove);
  const onObjectTransform = useMutableCallback(callbacks.onObjectTransform);
  const onClickOutside = useMutableCallback(callbacks.onClickOutside);
  // Sent from user1 to BE to trigger sparkles
  const onBumpReady = useMutableCallback(callbacks.onBumpReady);
  // TODO handle it

  useEffect(() => {
    return () => {
      // Cleaning everything
      events.off('SetWorld');
      events.off('AddObject');
      events.off('ObjectTextureChanged');
      events.off('ObjectTransform');
      events.off('UserAdded');
      events.off('UserRemoved');
      events.off('UsersTransformChanged');
      events.off('ObjectEditModeChanged');
      events.off('TriggerBump');
    };
  }, [events]);

  /* Will run one time. */
  const onSceneReady = async (scene: Scene) => {
    const view = scene.getEngine().getRenderingCanvas();
    const engine = scene.getEngine();
    if (view?.id) {
      PlayerHelper.initialize(scene, view, true, onMove, onBumpReady);
      LightHelper.initialize(scene);
      InteractionEffectHelper.initialize(scene);

      ObjectHelper.initialize(
        scene,
        engine,
        //  props.objects,
        view,
        onObjectClick,
        onUserClick,
        onClickOutside
        // onMove,
      );

      await WorldCreatorHelper.initialize(scene, onObjectTransform);
      //SkyboxHelper.setCubemapSkybox(scene);
      SkyboxHelper.set360Skybox(
        scene,
        //'https://dev2.odyssey.ninja/api/v3/render/texture/s8/26485e74acb29223ba7a9fa600d36c7f'
        skyboxWorld
      );

      if (window.sessionStorage.getItem('babylon_debug')) {
        Promise.all([
          import('@babylonjs/core/Debug/debugLayer'),
          import('@babylonjs/inspector')
        ]).then(() => {
          scene.debugLayer.show({overlay: true});
        });
      }

      events.on('SetWorld', (world, userId) => {
        // Commented out the actual line, as currently the assetID coming from BE is a Unity asset, so doesn't load
        //CameraHelper.spawnPlayer(scene, assetID);
        PlayerHelper.setWorld(world, userId);
        //PlayerHelper.spawnPlayer(scene, 'd906e070-3d2e-b1a5-3e3f-703423225945');
      });

      events.on('AddObject', async (object, attachToCamera = false) => {
        await ObjectHelper.spawnObjectAsync(scene, object, attachToCamera);
      });

      events.on('ObjectTextureChanged', (object) => {
        ObjectHelper.setObjectTexture(scene, object);
      });

      events.on('ObjectTransform', (id, object) => {
        WorldCreatorHelper.setObjectTransform(id, object);
        console.log('TODO handle ObjectTransform', id, object);
      });

      events.on('UserAdded', async (user) => {
        await PlayerHelper.userEnteredAsync(user);
      });

      events.on('UserRemoved', (userId) => {
        PlayerHelper.userRemove(userId);
      });

      events.on('UsersTransformChanged', (users) => {
        PlayerHelper.setUserTransforms(users);
      });

      events.on('ObjectEditModeChanged', (objectId, isOn) => {
        WorldCreatorHelper.toggleGizmo(objectId, isOn);
      });
      events.on('DetachObjectFromCamera', (objectId) => {
        ObjectHelper.detachFromCamera();
      });

      // Received by user1 to spawn particles
      events.on('SendHighFive', (userId) => {
        // This gets triggered with a delay, so handling this directly from the animation.
        //InteractionEffectHelper.startParticlesForPlayer();
      });
      // Received by user2 to spawn particles
      events.on('ReceiveHighFive', (userId) => {
        // This also gets triggered with a delay, but it is only for the receiving client
        InteractionEffectHelper.startParticlesForPlayer();
      });

      // Received by user1 to start chasing
      events.on('TriggerBump', (userId) => {
        PlayerHelper.followPlayer(userId);
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
