import {Scene, ArcRotateCamera} from '@babylonjs/core';
import * as BABYLON from '@babylonjs/core';

export class CameraHelper {
  static camera: ArcRotateCamera | null = null;

  static initialize(scene: Scene, canvas: HTMLCanvasElement): void {
    // Creates and positions a free camera
    this.camera = new ArcRotateCamera('odyssey-camera', 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
    // Targets the camera to scene origin
    this.camera.setTarget(BABYLON.Vector3.Zero());
    // Attaches the camera to the canvas
    this.camera.attachControl(canvas, true);
  }
}
