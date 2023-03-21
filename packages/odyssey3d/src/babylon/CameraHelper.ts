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

export class CameraHelper {
  static camera: UniversalCamera;
  static player: TransformNode;
  static normalSpeed = 0.5;
  static fastSpeed = 1;

  static initialize(scene: Scene, canvas: HTMLCanvasElement) {
    // This creates and positions a UniversalCamera camera (non-mesh)
    this.camera = new UniversalCamera('UniversalCamera', new Vector3(-5, 5, -15), scene);
    this.camera.rotationQuaternion = new Quaternion();
    this.camera.speed = this.normalSpeed;
    // This attaches the camera to the canvas
    this.camera.attachControl(canvas, true);

    // WASD controls
    this.camera.keysUp = [87];
    this.camera.keysLeft = [65];
    this.camera.keysDown = [83];
    this.camera.keysRight = [68];

    // Keyboard Input Listener
    // TODO: Move Action Manager and Key Input to some central place to be used from different scripts
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          CameraHelper.camera.speed = CameraHelper.fastSpeed;
        }
      })
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          CameraHelper.camera.speed = CameraHelper.normalSpeed;
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
