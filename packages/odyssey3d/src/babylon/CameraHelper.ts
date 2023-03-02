import {Scene, FreeCamera} from '@babylonjs/core';
import * as BABYLON from '@babylonjs/core';

export class CameraHelper {
  static camera: FreeCamera | null = null;

  static initialize(scene: Scene, canvas: HTMLCanvasElement): void {
    // Creates and positions a free camera
    this.camera = new FreeCamera('odyssey-camera', new BABYLON.Vector3(0, 5, -10), scene);
    // Targets the camera to scene origin
    this.camera.setTarget(BABYLON.Vector3.Zero());
    // Attaches the camera to the canvas
    this.camera.attachControl(canvas, true);
  }
}
