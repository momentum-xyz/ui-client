import {Scene, HemisphericLight} from '@babylonjs/core';
import * as BABYLON from '@babylonjs/core';

import {Object3dInterface} from '../core/interfaces';

export class ObjectHelper {
  static light: HemisphericLight | null = null;

  static initialize(scene: Scene, initialObjects: Object3dInterface[]): void {
    initialObjects.forEach((initialObject) => {
      this.spawnObject(scene, initialObject);
    });
  }

  static spawnObject(scene: Scene, object: Object3dInterface): void {
    switch (object.asset_3d_id) {
      // Type -> Sphere
      case '7e20a110-149b-4c6e-b1ab-a25cbdc066e6': {
        const options = {diameter: object.transform.scale, segments: 32};
        const sphere = BABYLON.MeshBuilder.CreateSphere(object.name, options, scene);

        sphere.position.x = object.transform.position.x;
        sphere.position.y = object.transform.position.y;
        sphere.position.z = object.transform.position.z;
        break;
      }
      default: {
        console.warn(`${object.asset_3d_id} is unknown asset_3d_id`);
      }
    }
  }
}
