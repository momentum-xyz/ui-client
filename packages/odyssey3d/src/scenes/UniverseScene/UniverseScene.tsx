import {FC} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';
import {useMutableCallback} from '@momentum-xyz/ui-kit';
import {Universe3dEmitterType} from '@momentum-xyz/core';

import {PlayerHelper, LightHelper, SkyboxHelper} from '../../babylon';

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

  const onSceneReady = (scene: Scene) => {
    console.log('onSceneReady', scene);
    const view = scene.getEngine().getRenderingCanvas();
    // const engine = scene.getEngine();
    if (view?.id) {
      PlayerHelper.initialize(scene, view);
      LightHelper.initialize(scene);
    }

    console.log('TODO attach callbacks', {onWorldClick, onUserClick, onClickOutside});

    events.on('WorldAdded', (world) => {
      console.log('WorldAdded', world);
      // TODO
    });

    events.on('UserAdded', (user) => {
      console.log('UserAdded', user);
      // TODO
    });

    SkyboxHelper.set360Skybox(
      scene,
      'https://dev2.odyssey.ninja/api/v3/render/texture/s8/27a7d8904d525b5d163754624ae46bc8'
    );

    PlayerHelper.spawnPlayer(scene, 'd906e070-3d2e-b1a5-3e3f-703423225945');

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
