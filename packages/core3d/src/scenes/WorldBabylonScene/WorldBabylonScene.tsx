import {FC, useEffect} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import {ObjectSoundInterface, Texture3dInterface} from '@momentum-xyz/core';
import {useMutableCallback} from '@momentum-xyz/ui-kit';

import {Odyssey3dPropsInterface} from '../../core/interfaces';
import {PlayerHelper, LightHelper, ObjectHelper} from '../../babylon';
import {WorldCreatorHelper} from '../../babylon/WorldCreatorHelper';
import {InteractionEffectHelper} from '../../babylon/InteractionEffectHelper';
import {ScreenCaptureHelper} from '../../babylon/ScreenCaptureHelper';
import {InputHelper} from '../../babylon/InputHelper';

const WorldBabylonScene: FC<Odyssey3dPropsInterface> = ({events, renderURL, ...callbacks}) => {
  const onObjectClick = useMutableCallback(callbacks.onObjectClick);
  const onUserClick = useMutableCallback(callbacks.onUserClick);
  const onMove = useMutableCallback(callbacks.onMove);
  const onObjectTransform = useMutableCallback(callbacks.onObjectTransform);
  const onClickOutside = useMutableCallback(callbacks.onClickOutside);
  const onReadyToHandleEvents = useMutableCallback(callbacks.onReadyToHandleEvents);
  // Sent from user1 to BE to trigger sparkles
  const onBumpReady = useMutableCallback(callbacks.onBumpReady);
  const onScreenshotReady = useMutableCallback(callbacks.onScreenshotReady);
  const onVideoReady = useMutableCallback(callbacks.onVideoReady);

  useEffect(() => {
    return () => {
      // Cleaning everything
      events.off('SetWorld');
      events.off('AddObject');
      events.off('ObjectTextureChanged');
      events.off('ObjectSoundChanged');
      events.off('ObjectEffectChanged');
      events.off('ObjectTransform');
      events.off('UserAdded');
      events.off('UserRemoved');
      events.off('UsersTransformChanged');
      events.off('ObjectEditModeChanged');
      events.off('TriggerBump');
      events.off('FlyToObject');
      events.off('StartRecordingVideo');
      events.off('StopRecordingVideo');
      events.off('MakeScreenshot');
      events.off('SendHighFive');
      events.off('DetachObjectFromCamera');
      events.off('ReceiveHighFive');
    };
  }, [events]);

  /* Will run one time. */
  const onSceneReady = async (scene: Scene) => {
    // important for better Highlight effect of selected objects
    scene.setRenderingAutoClearDepthStencil(1, false, false);

    const view = scene.getEngine().getRenderingCanvas();
    if (view?.id) {
      PlayerHelper.initialize({
        scene,
        canvas: view,
        rh: true,
        onMove,
        onSpawnParticles: onBumpReady
      });
      LightHelper.initialize(scene);
      InputHelper.initializeWorld(scene, onObjectClick, onUserClick, onClickOutside);
      ScreenCaptureHelper.initialize(scene, onScreenshotReady, onVideoReady);
      InteractionEffectHelper.initialize(scene);
      InteractionEffectHelper.initializeHi5Particles();

      ObjectHelper.initialize(
        scene,
        renderURL
        //  props.objects,
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

      if (window.sessionStorage.getItem('babylon_audio_debug')) {
        ObjectHelper.enableAnalyzer();
      }

      events.on('SetWorld', (world, userId) => {
        //CameraHelper.spawnPlayer(scene, assetID);
        PlayerHelper.setWorld(world, userId);
        ObjectHelper.setWorld(world);
      });

      events.on('MyInitialTransform', (transform) => {
        PlayerHelper.setInitialPosition(transform);
      });

      events.on('AddObject', async (object, attachToCamera = false) => {
        await ObjectHelper.spawnObjectAsync(scene, object, attachToCamera);
      });

      events.on('RemoveObject', (objectId) => {
        ObjectHelper.removeObject(objectId);
      });

      events.on('ObjectTextureChanged', (object: Texture3dInterface) => {
        ObjectHelper.objectTextureChange(scene, object);
      });

      events.on('ObjectSoundChanged', (objectId: string, soundData: ObjectSoundInterface) => {
        ObjectHelper.objectSoundChange(scene, objectId, soundData);
      });

      events.on('ObjectEffectChanged', (objectId: string, effect: string) => {
        ObjectHelper.objectEffectChange(objectId, effect);
      });

      events.on('ObjectTransform', (id, object) => {
        WorldCreatorHelper.setObjectTransform(id, object);
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

      events.on('FlyToObject', (objectId) => {
        const node = ObjectHelper.objectsMap.get(objectId)?.getNode();
        if (node) {
          PlayerHelper.flyToObject(node);
        }
      });

      events.on('MakeScreenshot', () => {
        ScreenCaptureHelper.takeScreenshot();
      });
      events.on('StartRecordingVideo', (maxDuration) => {
        ScreenCaptureHelper.recordVideo(maxDuration);
      });
      events.on('StopRecordingVideo', () => {
        ScreenCaptureHelper.stopRecordVideo();
      });

      onReadyToHandleEvents();
    } else {
      console.error('There is no canvas for Babylon.');
    }
  };

  /* Will run on every frame render. It is useful for animations */
  const onRender = (scene: Scene) => {
    // console.log(scene.getEngine().getDeltaTime());
    PlayerHelper.onRender();
  };

  return (
    <div
      data-testid="Babylon-scene"
      style={{
        // fixes strange offset appearing when creator plugin is opened
        display: 'flex'
      }}
    >
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

export default WorldBabylonScene;
