import {
  Scene,
  SceneLoader,
  AssetContainer,
  PBRMaterial,
  InstantiatedEntries,
  TransformNode,
  Color3
} from '@babylonjs/core';
import {Object3dInterface, ObjectTransformInterface} from '@momentum-xyz/core';

import {EffectsEnum} from '../index.pkg';

import {getAssetFileName} from './UtilityHelper';
import {ObjectHelper} from './ObjectHelper';
import {posToVec3} from './TransformHelper';

export class ObjectInstance {
  scene: Scene;

  protected container?: AssetContainer;
  objectDefinition: Object3dInterface;
  protected objectInstance?: InstantiatedEntries;
  protected cloneWithEffect?: TransformNode;
  protected effect?: EffectsEnum;

  constructor(scene: Scene, objectDefinition: Object3dInterface) {
    this.scene = scene;
    this.objectDefinition = objectDefinition;
  }

  async load(): Promise<void> {
    const assetUrl = getAssetFileName(this.objectDefinition.asset_3d_id);
    const object = this.objectDefinition;

    this.container = await SceneLoader.LoadAssetContainerAsync(
      ObjectHelper.assetRootUrl,
      assetUrl,
      this.scene,
      (event) => {
        // On progress callback
        //console.log(`Loading progress ${event.loaded}/${event.total}`);
      },
      '.glb'
    );
    // this.instantiateObject(container, object, attachToCam);

    const instance = this.container.instantiateModelsToScene();
    const node = instance.rootNodes[0];
    if (!(node instanceof TransformNode)) {
      console.log(
        'instance.rootNodes.length === 0. Something went wrong with loading ' + object.asset_3d_id
      );
      throw new Error('Unable to load the object');
    }

    node.name = object.name;

    node.position = posToVec3(object.transform.position);
    node.rotation = posToVec3(object.transform.rotation);
    node.scaling = posToVec3(object.transform.scale);
    node.metadata = object.id;

    // Play animations
    for (const group of instance.animationGroups) {
      group.play(true);
    }
  }

  dispose(): void {
    this.objectInstance?.dispose();
    this.container?.removeFromScene();
    this.container?.dispose();
    this.cloneWithEffect?.dispose();
  }

  getNode(): TransformNode {
    return this.cloneWithEffect || (this.objectInstance?.rootNodes[0] as TransformNode);
  }

  setTransform(transform: ObjectTransformInterface): void {
    const node = this.getNode();
    node.position = posToVec3(transform.position);
    node.rotation = posToVec3(transform.rotation);
    node.scaling = posToVec3(transform.scale);
  }

  setEffect(effect: EffectsEnum, force = false): void {
    if (!this.objectInstance) {
      throw new Error('ObjectInstance not loaded');
    }

    if (effect === EffectsEnum.NONE) {
      if (!this.cloneWithEffect) {
        return;
      }
      console.log('setObjectEffect: removing effect');
      this.cloneWithEffect.dispose();
      this.cloneWithEffect = undefined;
      this.effect = undefined;

      // make sure the object is visible
      const childMeshes = this.objectInstance.rootNodes[0].getChildMeshes();
      childMeshes.forEach((element) => {
        element.setEnabled(true);
      });
      console.log('setObjectEffect: original object is visible');
    } else if (effect === EffectsEnum.TRANSPARENT) {
      if (this.effect === effect && !force) {
        return;
      }
      if (this.cloneWithEffect) {
        this.cloneWithEffect.dispose();
      }

      const node = this.objectInstance.rootNodes[0];
      const clone = node.clone('clone', node.parent);
      if (!(clone instanceof TransformNode)) {
        console.log('setObjectEffect: clone is not a TransformNode');
        return;
      }
      // const effectMat = new StandardMaterial('effect', this.scene);
      const effectMat = new PBRMaterial('effect', this.scene);
      effectMat.albedoColor = Color3.Teal();
      effectMat.emissiveColor = Color3.White();
      effectMat.reflectivityColor = Color3.Green();
      effectMat.alpha = 0.7;

      const cloneChildren = clone.getChildMeshes();
      cloneChildren.forEach((element) => {
        element.material = effectMat;
        // console.log('setObjectEffect:', objectId, 'element', element, element.material);
        // if (element.material) {
        //   element.material.alpha = 0.4;
        // }
      });
      console.log('setObjectEffect: effect added');

      this.cloneWithEffect = clone;
      this.effect = effect;

      const childMeshes = node.getChildMeshes();
      childMeshes.forEach((element) => {
        element.setEnabled(false);
      });
      console.log('setObjectEffect: original object is hidden');
    } else {
      console.log('setObjectEffect: unknown effect:', effect);
    }
  }
}
