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

import {EffectsEnum} from '../core/enums';

import {getAssetFileName} from './UtilityHelper';
import {ObjectHelper} from './ObjectHelper';
import {posToVec3} from './TransformHelper';

const validateEffect = (effect: string): EffectsEnum => {
  if (Object.values(EffectsEnum).includes(effect as EffectsEnum)) {
    return effect as EffectsEnum;
  }
  throw new Error('Invalid effect');
};

export class ObjectInstance {
  scene: Scene;
  objectDefinition: Object3dInterface;

  protected container?: AssetContainer;
  protected instance?: InstantiatedEntries;

  // Cloned instance with applied effect like transparency
  // It allows to keep the original instance unchanged but could lead to some unexpected behavior
  // when switching when setting/clearing the effect
  // An alternative could be having different sets of materials applied to the object meshes
  // while having only one instance of the object
  protected cloneWithEffect?: TransformNode;
  protected effect?: EffectsEnum;

  protected effectsStack: EffectsEnum[] = [];

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

    const instance = this.container.instantiateModelsToScene();
    const node = instance.rootNodes[0];
    if (!(node instanceof TransformNode)) {
      console.log(
        'instance.rootNodes.length === 0. Something went wrong with loading ' + object.asset_3d_id
      );
      throw new Error('Unable to load the object');
    }
    this.instance = instance;

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
    this.instance?.dispose();
    this.container?.removeFromScene();
    this.container?.dispose();
    this.cloneWithEffect?.dispose();
  }

  getNode(rootNode = false): TransformNode {
    return (!rootNode && this.cloneWithEffect) || (this.instance?.rootNodes[0] as TransformNode);
  }

  setTransform(transform: ObjectTransformInterface): void {
    const node = this.instance?.rootNodes[0] as TransformNode;
    node.position = posToVec3(transform.position);
    node.rotation = posToVec3(transform.rotation);
    node.scaling = posToVec3(transform.scale);
    if (this.cloneWithEffect) {
      this.cloneWithEffect.position = posToVec3(transform.position);
      this.cloneWithEffect.rotation = posToVec3(transform.rotation);
      this.cloneWithEffect.scaling = posToVec3(transform.scale);
    }
  }

  setPosition(position: ObjectTransformInterface['position']): void {
    const node = this.instance?.rootNodes[0] as TransformNode;
    node.position = posToVec3(position);
    if (this.cloneWithEffect) {
      this.cloneWithEffect.position = posToVec3(position);
    }
  }

  setParent(parent: TransformNode | null): void {
    const node = this.instance?.rootNodes[0] as TransformNode;
    node.setParent(parent, undefined, true);
    if (this.cloneWithEffect) {
      this.cloneWithEffect.setParent(parent, undefined, true);
    }
  }

  setEffect(effect: string, stackable = true): void {
    let eff = validateEffect(effect);

    if (this.effect) {
      if (eff === EffectsEnum.NONE) {
        if (this.effectsStack.length > 0) {
          eff = this.effectsStack.pop() as EffectsEnum;
          console.log('setObjectEffect: restoring effect', eff);
        }
      } else {
        if (stackable) {
          console.log('setObjectEffect: stacking effect', eff);
          this.effectsStack.push(eff);
          return;
        } else {
          console.log('setObjectEffect: replacing effect', eff);
          this.effectsStack.push(this.effect);
        }
      }
    }
    this._setEffect(eff);
  }

  private _setEffect(effect: string): void {
    if (!this.instance) {
      throw new Error('ObjectInstance not loaded');
    }
    console.log('setObjectEffect', this.objectDefinition.id, effect);

    switch (effect) {
      case EffectsEnum.NONE: {
        if (!this.cloneWithEffect) {
          return;
        }

        const parent = this.getNode().parent;

        console.log('setObjectEffect: removing effect');
        this.cloneWithEffect.dispose();
        this.cloneWithEffect = undefined;
        this.effect = undefined;

        this.getNode().setParent(parent);

        // make sure the object is visible
        this.setMeshesVisibility(true);
        break;
      }
      case EffectsEnum.TRANSPARENT:
      case EffectsEnum.SPAWN_PREVIEW: {
        if (this.effect === effect) {
          return;
        }

        const parent = this.getNode().parent;

        if (this.cloneWithEffect) {
          this.cloneWithEffect.dispose();
        }

        const node = this.instance.rootNodes[0];
        const clone = node.clone(`${node.name} - Effect Clone`, parent);
        if (!(clone instanceof TransformNode)) {
          console.log('setObjectEffect: clone is not a TransformNode');
          return;
        }

        const effectMat = new PBRMaterial('effect', this.scene);

        if (effect === EffectsEnum.TRANSPARENT) {
          effectMat.albedoColor = Color3.Teal();
          effectMat.emissiveColor = Color3.White();
          effectMat.reflectivityColor = Color3.Green();
          effectMat.alpha = 0.7;
        } else if (effect === EffectsEnum.SPAWN_PREVIEW) {
          effectMat.albedoColor = Color3.Gray();
          effectMat._reflectivityColor = Color3.Gray();
          effectMat.alpha = 0.3;
        } else {
          console.log('WTF! setObjectEffect: unknown effect:', effect);
        }

        const cloneChildren = clone.getChildMeshes();
        cloneChildren.forEach((element) => {
          element.material = effectMat;
          element.setEnabled(true);
        });
        console.log('setObjectEffect: effect added:', effect);

        this.cloneWithEffect = clone;
        this.effect = effect;

        this.setMeshesVisibility(false);
        break;
      }
      default:
        console.log('setObjectEffect: unknown effect:', effect);
    }
  }

  private setMeshesVisibility(visible: boolean): void {
    if (!this.instance) {
      throw new Error('ObjectInstance not loaded');
    }
    const node = this.instance.rootNodes[0];
    const childMeshes = node.getChildMeshes();
    childMeshes.forEach((element) => {
      element.setEnabled(visible);
    });
  }
}
