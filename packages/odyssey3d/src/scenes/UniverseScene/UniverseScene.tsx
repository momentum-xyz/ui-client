import {FC} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import {useMutableCallback} from '@momentum-xyz/ui-kit';
import {Universe3dEmitterType} from '@momentum-xyz/core';

import {PlayerHelper, LightHelper, SkyboxHelper} from '../../babylon';
import {UniverseBuilderHelper} from '../../babylon/UniverseBuilderHelper';

export interface PropsInterface {
  events: Universe3dEmitterType;
  onWorldClick: (id: string) => void;
  onUserClick: (id: string) => void;
  onClickOutside: () => void;
}

export const UniverseScene: FC<PropsInterface> = ({events, ...callbacks}) => {
  const onWorldClick = useMutableCallback(callbacks.onWorldClick);
  const onUserClick = useMutableCallback(callbacks.onUserClick);
  const onClickOutside = useMutableCallback(callbacks.onClickOutside);

  const onSceneReady = async (scene: Scene) => {
    SkyboxHelper.set360Skybox(
      scene,
      'https://dev2.odyssey.ninja/api/v3/render/texture/s8/27a7d8904d525b5d163754624ae46bc8'
    );

    console.log('onSceneReady', scene);
    const view = scene.getEngine().getRenderingCanvas();
    // const engine = scene.getEngine();
    if (view?.id) {
      PlayerHelper.initialize(scene, view);
      LightHelper.initialize(scene);
      await UniverseBuilderHelper.initialize(scene);
    }

    console.log('TODO attach callbacks', {onWorldClick, onUserClick, onClickOutside});

    events.on('WorldsAdded', (worlds) => {
      console.log('WorldsAdded', worlds);
      // TODO
      UniverseBuilderHelper.buildRingLayers(worlds);
    });

    events.on('UsersAdded', (users) => {
      console.log('UsersAdded', users);
      // TODO
      UniverseBuilderHelper.buildAccountLayer(users);
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
