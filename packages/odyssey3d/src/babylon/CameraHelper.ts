import {
  Scene,
  //ArcRotateCamera,
  //UniversalCamera,
  FreeCamera,
  Vector3,
  Quaternion,
  TransformNode,
  SceneLoader,
  AssetContainer
} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';
//import * as BABYLON from '@babylonjs/core';

export class CameraHelper {
  //static camera: ArcRotateCamera | null = null;
  static camera: FreeCamera | null = null;
  static player: TransformNode;

  static initialize(scene: Scene, canvas: HTMLCanvasElement) {
    // This creates and positions a free camera (non-mesh)
    this.camera = new FreeCamera('camera1', new Vector3(-5, 5, -15), scene);
    this.camera.rotationQuaternion = new Quaternion();
    this.camera.speed = 0.5;
    // This attaches the camera to the canvas
    this.camera.attachControl(canvas, true);
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
