import {FC, useEffect, useMemo, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {
  Vector3,
  Scene,
  Color3,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  ActionManager,
  ExecuteCodeAction,
  InstancedMesh
} from '@babylonjs/core';
import {
  Scene as ReactScene,
  Engine,
  // useBeforeRender,
  useScene
} from 'react-babylonjs';
// import SceneComponent from 'babylonjs-hook';
import {useMutableCallback} from '@momentum-xyz/ui-kit';
import {Universe3dEmitterType, WorldInfoInterface} from '@momentum-xyz/core';

import {PlayerHelper, LightHelper, SkyboxHelper} from '../../babylon';

export interface PropsInterface {
  events: Universe3dEmitterType;
  worlds: WorldInfoInterface[];
  // users: User[];

  onWorldClick: (id: string) => void;
  onUserClick: (id: string) => void;
  onClickOutside: () => void;
}

const generateRandomVector3 = (minRange = -50, maxRange = 50): Vector3 =>
  new Vector3(
    Math.random() * (maxRange - minRange) + minRange,
    Math.random() * (maxRange - minRange) + minRange,
    Math.random() * (maxRange - minRange) + minRange
  );

const WorldOrb: FC<{
  baseMesh: Mesh;
  info: WorldInfoInterface;
  position?: Vector3;
  onClick?: () => void;
}> = ({baseMesh, info, position = generateRandomVector3(), onClick}) => {
  const scene = useScene();
  const {id, name} = info;
  console.log('World', id, name, position);

  const ref = useRef<InstancedMesh>(null);

  useEffect(() => {
    const inst = ref.current;
    if (inst && onClick && !inst.actionManager) {
      inst.actionManager = new ActionManager(scene);
      inst.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, onClick)
      );
    }
  }, [scene, onClick]);

  return (
    <instancedMesh
      name={`World ${info.id}`}
      ref={ref}
      source={baseMesh}
      position={position}
      disposeInstanceOnUnmount
    >
      {/* <standardMaterial
    name="material"
    diffuseColor={Color3.Yellow()}
    specularColor={Color3.Black()}
  /> */}
    </instancedMesh>
  );
};

const Worlds: FC<{position: Vector3; items: WorldInfoInterface[]}> = observer(
  ({position, items}) => {
    const scene = useScene();
    const baseMesh = useMemo(() => {
      if (!scene) {
        return null;
      }

      const baseSphere = MeshBuilder.CreateSphere('World', {diameter: 1}, scene);
      // baseSphere.isVisible = false; // Made the original sphere invisible.

      // const hdrTextureAccounts = new HDRCubeTexture(
      //   hdrImageTexture,
      //   scene,
      //   512,
      //   false,
      //   true,
      //   false,
      //   true
      // );
      const glassMaterial = new PBRMaterial('glass', scene);
      // glassMaterial.reflectionTexture = hdrTextureAccounts;
      glassMaterial.indexOfRefraction = 0.52;
      glassMaterial.alpha = 0.5;
      glassMaterial.directIntensity = 0.0;
      glassMaterial.environmentIntensity = 0.7;
      glassMaterial.cameraExposure = 0.66;
      glassMaterial.cameraContrast = 1.66;
      glassMaterial.microSurface = 1;
      glassMaterial.reflectivityColor = new Color3(0.2, 0.2, 0.2);
      glassMaterial.albedoColor = new Color3(0.95, 0.95, 0.95);
      baseSphere.material = glassMaterial;
      return baseSphere;
    }, [scene]);

    if (!baseMesh) {
      return null;
    }

    return (
      <transformNode name="worlds" position={position}>
        {items.map((world) => (
          <WorldOrb
            key={world.id}
            baseMesh={baseMesh}
            info={world}
            onClick={() => {
              console.log('WorldOrb: onClick', world.id);
            }}
          />
        ))}
      </transformNode>
    );
  }
);

const UniverseScene: FC<PropsInterface> = ({worlds, events, ...callbacks}) => {
  const onWorldClick = useMutableCallback(callbacks.onWorldClick);
  const onUserClick = useMutableCallback(callbacks.onUserClick);
  const onClickOutside = useMutableCallback(callbacks.onClickOutside);

  const onSceneReady = (props: {scene: Scene; canvas: HTMLCanvasElement}) => {
    const {
      scene
      // canvas
    } = props;
    console.log('onSceneReady', scene);

    // canvas.style.width = '100vw';
    // canvas.style.height = '100vh';

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

  return (
    <div data-testid="Babylon-scene">
      {/* <SceneComponent
        id="babylon-canvas"
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        style={{width: '100vw', height: '100vh'}}
      /> */}
      <Engine
        antialias
        adaptToDeviceRatio
        canvasId="babylon-js"
        renderOptions={{
          whenVisibleOnly: true
        }}
        style={{width: '100vw', height: '100vh'}}
      >
        <ReactScene onSceneMount={onSceneReady}>
          {/* <freeCamera
            name="camera1"
            position={new Vector3(0, 5, -10)}
            setTarget={[Vector3.Zero()]}
          /> */}

          <hemisphericLight name="light1" intensity={0.7} direction={new Vector3(0, 1, 0)} />

          <Worlds position={new Vector3(0, 10, 100)} items={worlds} />
        </ReactScene>
      </Engine>
    </div>
  );
};

export default observer(UniverseScene);
