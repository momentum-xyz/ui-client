import {
  Scene,
  UniversalCamera,
  Vector3,
  Quaternion,
  TransformNode,
  SceneLoader,
  AssetContainer,
  ActionManager,
  ExecuteCodeAction
} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';

const NormalSpeed = 0.5;
const FastSpeed = 1.5;

export class CameraHelper {
  static camera: UniversalCamera;
  static player: TransformNode;

  static initialize(scene: Scene, canvas: HTMLCanvasElement) {
    // This creates and positions a UniversalCamera camera (non-mesh)
    const camera = new UniversalCamera('UniversalCamera', new Vector3(-5, 5, -15), scene);
    camera.rotationQuaternion = new Quaternion();
    camera.speed = NormalSpeed;
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // WASD controls
    camera.keysUp = [87];
    camera.keysLeft = [65];
    camera.keysDown = [83];
    camera.keysRight = [68];

    this.camera = camera;

    // Keyboard Input Listener
    // TODO: Move Action Manager and Key Input to some central place to be used from different scripts
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          CameraHelper.camera.speed = FastSpeed;
        }
      })
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          CameraHelper.camera.speed = NormalSpeed;
        }
      })
    );
  }

  static spawnPlayer(scene: Scene, assetID: string) {
    const assetUrl = ObjectHelper.getAssetFileName(assetID);
    SceneLoader.LoadAssetContainer(
      ObjectHelper.assetRootUrl,
      assetUrl,
      scene,
      (container) => {
        this.playerInstantiate(container);
      },
      (event) => {},
      (scene, message) => {
        // On error callback
        console.log(assetID + ' failed loading!: ' + message);
      },
      '.glb'
    );
  }

  static playerInstantiate(container: AssetContainer) {
    const instance = container.instantiateModelsToScene();

    if (instance.rootNodes.length === 0) {
      console.log('instance.rootNodes.length === 0 when spawning player');
      return;
    }

    instance.rootNodes[0].name = 'Player';
    this.player = instance.rootNodes[0];
    this.player.parent = this.camera;
    this.player.position = new Vector3(0, -0.5, 2);
    this.player.rotation = new Vector3(0, 0, 0);
    this.player.scaling = new Vector3(1, 1, 1);
    // Animations
    for (const group of instance.animationGroups) {
      group.play(true);
    }
  }
}
