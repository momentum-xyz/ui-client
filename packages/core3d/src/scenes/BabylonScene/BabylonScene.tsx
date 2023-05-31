import {FC, useEffect} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import {useMutableCallback} from '@momentum-xyz/ui-kit';

import {Odyssey3dPropsInterface} from '../../core/interfaces';
import {PlayerHelper, LightHelper, ObjectHelper} from '../../babylon';
import {WorldCreatorHelper} from '../../babylon/WorldCreatorHelper';
import {InteractionEffectHelper} from '../../babylon/InteractionEffectHelper';
import {ScreenCaptureHelper} from '../../babylon/ScreenCaptureHelper';

const BabylonScene: FC<Odyssey3dPropsInterface> = ({events, renderURL, ...callbacks}) => {
  const onObjectClick = useMutableCallback(callbacks.onObjectClick);
  const onUserClick = useMutableCallback(callbacks.onUserClick);
  const onMove = useMutableCallback(callbacks.onMove);
  const onObjectTransform = useMutableCallback(callbacks.onObjectTransform);
  const onClickOutside = useMutableCallback(callbacks.onClickOutside);
  const onReadyToHandleEvents = useMutableCallback(callbacks.onReadyToHandleEvents);
  // Sent from user1 to BE to trigger sparkles
  const onBumpReady = useMutableCallback(callbacks.onBumpReady);

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
    // important for better Highlight effect of selected objects
    scene.setRenderingAutoClearDepthStencil(1, false, false);

    const view = scene.getEngine().getRenderingCanvas();
    if (view?.id) {
      PlayerHelper.initialize(scene, view, true, onMove, onBumpReady);
      LightHelper.initialize(scene);
      ScreenCaptureHelper.initialize(scene);
      InteractionEffectHelper.initialize(scene);
      InteractionEffectHelper.initializeHi5Particles();

      ObjectHelper.initialize(
        scene,
        renderURL,
        //  props.objects,
        onObjectClick,
        onUserClick,
        onClickOutside
        // onMove,
      );

      await WorldCreatorHelper.initialize(scene, onObjectTransform);

      if (window.sessionStorage.getItem('babylon_debug')) {
        Promise.all([
          import('@babylonjs/core/Debug/debugLayer'),
          import('@babylonjs/inspector')
        ]).then(() => {
          scene.debugLayer.show({
            overlay: true,
            globalRoot: document.body
          });
        });
      }

      events.on('SetWorld', (world, userId) => {
        //CameraHelper.spawnPlayer(scene, assetID);
        PlayerHelper.setWorld(world, userId);
        ObjectHelper.setWorld(world);
      });

      events.on('AddObject', async (object, attachToCamera = false) => {
        await ObjectHelper.spawnObjectAsync(scene, object, attachToCamera);
      });

      events.on('RemoveObject', (objectId) => {
        ObjectHelper.removeObject(objectId);
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

      events.on('ObjectEditModeChanged', (objectId, isOn, showGizmo) => {
        console.log('Babylon: handle ObjectEditModeChanged', objectId, {isOn, showGizmo});
        WorldCreatorHelper.toggleGizmo(objectId, showGizmo);
        WorldCreatorHelper.toggleHightlightObject(objectId, isOn);
      });
      events.on('DetachObjectFromCamera', (objectId) => {
        ObjectHelper.detachFromCamera();
      });

      events.on('SendHighFive', (userId) => {});

      // Received by user2 to spawn particles
      events.on('ReceiveHighFive', (userId) => {
        InteractionEffectHelper.startHi5ParticlesForPlayer();
      });

      // Received by user1 to start chasing
      events.on('TriggerBump', (userId) => {
        PlayerHelper.followPlayer(userId);
      });

      onReadyToHandleEvents();
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
        engineOptions={{
          stencil: true
        }}
        onSceneReady={onSceneReady}
        onRender={onRender}
        style={{width: '100vw', height: '100vh'}}
      />
    </div>
  );
};

export default BabylonScene;
