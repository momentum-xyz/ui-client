/* eslint-disable @typescript-eslint/no-unused-vars */

import {FC, useEffect} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import {Universe3dEmitterType} from '@momentum-xyz/core';
import {useMutableCallback} from '@momentum-xyz/ui-kit';

import {PlayerHelper, LightHelper, SkyboxHelper} from '../../babylon';
import {
  CAMERA_POS_EXPLORER,
  CAMERA_TARGET_EXPLORER,
  UniverseBuilderHelper
} from '../../babylon/UniverseBuilderHelper';
import {InteractionEffectHelper} from '../../babylon/InteractionEffectHelper';
import skyboxWorld from '../../static/CLOUDSCAPE.jpg';
import {InputHelper} from '../../babylon/InputHelper';
import {WhispControllable} from "../../babylon/WhispControllable";

export interface PropsInterface {
  events: Universe3dEmitterType;
  renderURL: string;
  onWorldClick: (id: string) => void;
  onUserClick: (id: string) => void;
  onClickOutside: () => void;
  onReadyToHandleEvents: () => void;
}

export const UniverseScene: FC<PropsInterface> = ({events, renderURL, ...callbacks}) => {
  const onWorldClick = useMutableCallback(callbacks.onWorldClick);
  const onUserClick = useMutableCallback(callbacks.onUserClick);
  const onClickOutside = useMutableCallback(callbacks.onClickOutside);
  const onReadyToHandleEvents = useMutableCallback(callbacks.onReadyToHandleEvents);
  let player!: WhispControllable;

  useEffect(() => {
    return () => {
      // Cleaning everything
      events.off('WorldsAdded');
      events.off('UsersAdded');
      events.off('UserSelected');
      events.off('WorldSelected');
    };
  }, [events]);

  const onSceneReady = async (scene: Scene) => {
    SkyboxHelper.set360Skybox(scene, skyboxWorld);

    console.log('onSceneReady', scene);
    const view = scene.getEngine().getRenderingCanvas();
    if (view?.id) {
      player = new WhispControllable(scene);

      // PlayerHelper.initialize(scene, view, false);
      InputHelper.initializeUniverse(scene, onWorldClick, onUserClick, onClickOutside);
      LightHelper.initialize(scene);
      InteractionEffectHelper.initialize(scene);
      await UniverseBuilderHelper.initialize(scene, renderURL);
    }

    events.on('WorldsAdded', (worlds) => {
      console.log('WorldsAdded', worlds);
      UniverseBuilderHelper.buildNewRingOdysseys(worlds);
    });

    events.on('UsersAdded', (users) => {
      console.log('UsersAdded', users);
      UniverseBuilderHelper.buildNewRingAccounts(users);
    });

    events.on('UserSelected', (id) => {
      console.log('Babylon: UserSelected ', id);
    });

    events.on('WorldSelected', (id) => {
      console.log('Babylon: WorldSelected ', id);
    });

    onReadyToHandleEvents();

    // PlayerHelper.spawnPlayer(scene, CAMERA_POS_EXPLORER, CAMERA_TARGET_EXPLORER);

    if (window.sessionStorage.getItem('babylon_debug')) {
      Promise.all([
        import('@babylonjs/core/Debug/debugLayer'),
        import('@babylonjs/inspector')
      ]).then(() => {
        scene.debugLayer.show({overlay: true});
      });
    }
  };

  const onRender = (scene: Scene) => {
    if (scene.deltaTime) {
      player?.update(Math.min(scene.deltaTime * .001, 1));
    }
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
