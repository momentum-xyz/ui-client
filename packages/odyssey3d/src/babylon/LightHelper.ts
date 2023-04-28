import {Scene, HemisphericLight, Vector3} from '@babylonjs/core';

export class LightHelper {
  static light: HemisphericLight | null = null;

  static initialize(scene: Scene): void {
    // Creates a light, aiming 0,1,0
    this.light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    // Dim the light a small amount 0 - 1
    this.light.intensity = 0.7;
    scene.createDefaultEnvironment({createSkybox:false});
  }
}
