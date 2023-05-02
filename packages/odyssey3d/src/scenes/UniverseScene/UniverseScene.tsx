import {FC, useEffect} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import {useMutableCallback} from '@momentum-xyz/ui-kit';
import {Universe3dEmitterType} from '@momentum-xyz/core';

import {PlayerHelper, LightHelper, SkyboxHelper} from '../../babylon';
import {UniverseBuilderHelper} from '../../babylon/UniverseBuilderHelper';
import skyboxWorld from '../../static/mushjungledark.jpeg';

export interface PropsInterface {
  events: Universe3dEmitterType;
  renderURL: string;
  onWorldClick: (id: string) => void;
  onUserClick: (id: string) => void;
  onClickOutside: () => void;
}

export const UniverseScene: FC<PropsInterface> = ({events, renderURL, ...callbacks}) => {
  const onWorldClick = useMutableCallback(callbacks.onWorldClick);
  const onUserClick = useMutableCallback(callbacks.onUserClick);
  const onClickOutside = useMutableCallback(callbacks.onClickOutside);

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
    SkyboxHelper.set360Skybox(
      scene,
      //'https://dev2.odyssey.ninja/api/v3/render/texture/s8/27a7d8904d525b5d163754624ae46bc8'
      skyboxWorld
    );

    console.log('onSceneReady', scene);
    const view = scene.getEngine().getRenderingCanvas();
    if (view?.id) {
      PlayerHelper.initialize(scene, view, false);
      LightHelper.initialize(scene);
      await UniverseBuilderHelper.initialize(
        scene,
        renderURL,
        onWorldClick,
        onUserClick,
        onClickOutside
      );
    }

    events.on('WorldsAdded', (worlds) => {
      console.log('WorldsAdded', worlds);
      UniverseBuilderHelper.buildRingLayers(worlds);
    });

    events.on('UsersAdded', (users) => {
      console.log('UsersAdded', users);
      UniverseBuilderHelper.buildAccountLayer(users);
    });

    events.on('UserSelected', (id) => {
      console.log('Babylon: UserSelected ', id);
    });

    events.on('WorldSelected', (id) => {
      console.log('Babylon: WorldSelected ', id);
    });

    PlayerHelper.spawnPlayer(scene);

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
    // console.log('onRender', scene);
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
