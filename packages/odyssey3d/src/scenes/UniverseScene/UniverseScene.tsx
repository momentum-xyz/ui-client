import {FC} from 'react';
import {Scene} from '@babylonjs/core';
import SceneComponent from 'babylonjs-hook';

import {PlayerHelper, LightHelper, SkyboxHelper} from '../../babylon';

export const UniverseScene: FC = () => {
  const onSceneReady = (scene: Scene) => {
    console.log('onSceneReady', scene);
    const view = scene.getEngine().getRenderingCanvas();
    // const engine = scene.getEngine();
    if (view?.id) {
      PlayerHelper.initialize(scene, view);
      LightHelper.initialize(scene);
    }

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
    console.log('onRender', scene);
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
