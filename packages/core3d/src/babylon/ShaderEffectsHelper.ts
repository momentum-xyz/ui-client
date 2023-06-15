import {NodeMaterial, Scene} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';
import {InputHelper} from './InputHelper';

export class ShaderEffectsHelper {
  static scene: Scene;
  static lastEffectObjId: string;

  static initialize(scene: Scene): void {
    this.scene = scene;
  }

  static setShaderForObject(snippedID: string, objectId: string) {
    NodeMaterial.ParseFromSnippetAsync('#JN2BSF#8', ObjectHelper.scene).then((myNodeMat) => {
      myNodeMat.build();

      const objInterface = ObjectHelper.objectsMap.get(InputHelper.selectedObjectID);

      if (objInterface === undefined) {
        console.log('Couldnt find object in object map with the id of: ' + objectId);
      } else {
        const childMeshes = objInterface.objectInstance.rootNodes[0].getChildMeshes();
        childMeshes.forEach((element) => {
          element.material = myNodeMat;
        });
        this.lastEffectObjId = InputHelper.selectedObjectID;
      }
    });
  }

  static changeEffectValues(objectId: string, changeMultiplier: number) {
    const objInterface = ObjectHelper.objectsMap.get(this.lastEffectObjId);

    if (objInterface === undefined) {
      console.log('Couldnt find object in object map with the id of: ' + objectId);
    } else {
      const childMeshes = objInterface.objectInstance.rootNodes[0].getChildMeshes();
      childMeshes.forEach((element) => {
        const myNodeMat = element.material as NodeMaterial;
        const matInputBlocks = myNodeMat.getInputBlocks();

        matInputBlocks.forEach((element) => {
          if (element.name === 'Structure') {
            element.value += 0.05 * changeMultiplier;
          }
          if (element.name === 'Frequency') {
            element.value += 0.5 * changeMultiplier;
          }
        });
      });
    }
  }
}
