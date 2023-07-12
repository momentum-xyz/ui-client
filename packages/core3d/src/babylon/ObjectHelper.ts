import {
  Scene,
  SceneLoader,
  AssetContainer,
  InstantiatedEntries,
  PBRMaterial,
  TransformNode,
  Color3,
  Nullable,
  Vector3,
  Texture,
  Sound
} from '@babylonjs/core';
import {
  Object3dInterface,
  Texture3dInterface,
  SetWorldInterface,
  ObjectSoundInterface,
  SoundItemInterface
} from '@momentum-xyz/core';

import {EffectsEnum} from '../core/enums';

import {PlayerHelper} from './PlayerHelper';
import {SkyboxHelper} from './SkyboxHelper';
import {getAssetFileName, getBoundingInfo} from './UtilityHelper';
import {posToVec3} from './TransformHelper';
import {WorldCreatorHelper} from './WorldCreatorHelper';
import './initLoaderGLTF';

interface BabylonObjectInterface {
  container: AssetContainer;
  objectDefinition: Object3dInterface;
  objectInstance: InstantiatedEntries;
  cloneWithEffect?: TransformNode;
  effect?: EffectsEnum;
}

// Textures waiting for the object to spawn.
// Map texture labels to texture metadata
type SlotTexturesType = Map<string, Texture3dInterface>;
// Nested map: objectID, then (texture) label.
type AwaitingTexturesType = Map<string, SlotTexturesType>;
// Map: objectID, then sound data.
type AwaitingSoundType = Map<string, ObjectSoundInterface>;

export class ObjectHelper {
  static assetRootUrl = '/asset/';
  static trackRootUrl = '/track/';
  static textureRootUrl = '/texture/';
  static textureDefaultSize = 's3/';
  static objectsMap = new Map<string, BabylonObjectInterface>();
  static objectsSoundMap = new Map<string, Sound>();
  static scene: Scene;
  static attachedNode: TransformNode;
  static transformSubscription: {unsubscribe: () => void} | undefined;
  static selectedObjectFromSpawn = '';
  static spawningMaterial: PBRMaterial;
  static mySpawningClone: Nullable<TransformNode>;
  static awaitingTexturesMap: AwaitingTexturesType = new Map();
  static awaitingSoundMap: AwaitingSoundType = new Map();
  static awaitingEffectsMap = new Map<string, string>();

  static initialize(scene: Scene, assetBaseURL: string): void {
    this.scene = scene;
    scene.useRightHandedSystem = true;

    this.assetRootUrl = `${assetBaseURL}/asset/`;
    this.trackRootUrl = `${assetBaseURL}/track/`;
    this.textureRootUrl = `${assetBaseURL}/texture/`;
  }

  static setWorld(world: SetWorldInterface) {
    this.disposeAllObjects();
  }

  static async spawnObjectAsync(scene: Scene, object: Object3dInterface, attachToCam: boolean) {
    const existingObj = this.objectsMap.get(object.id);
    if (existingObj) {
      // TODO: compare/check for changes?
      this.removeObject(object.id);
    }

    const assetUrl = getAssetFileName(object.asset_3d_id);

    const container = await SceneLoader.LoadAssetContainerAsync(
      this.assetRootUrl,
      assetUrl,
      scene,
      (event) => {
        // On progress callback
        //console.log(`Loading progress ${event.loaded}/${event.total}`);
      },
      '.glb'
    );
    this.instantiateObject(container, object, attachToCam);
  }

  static objectTextureChange(scene: Scene, texture: Texture3dInterface): void {
    if (texture.label === 'skybox_custom') {
      // TODO: refactor special case for world objects.
      SkyboxHelper.set360Skybox(
        scene,
        this.textureRootUrl + SkyboxHelper.defaultSkyboxTextureSize + texture.hash
      );
      return;
    }
    // Handle textures arriving before objects are spawned.
    this.appendAwaitingTexture(texture);
    const obj = this.objectsMap.get(texture.objectId);
    if (obj) {
      this.setObjectTextures(obj, scene);
    } //else: spawnObject will check awaitingTextures
  }

  static objectSoundChange(scene: Scene, objectID: string, soundData: ObjectSoundInterface): void {
    // Handle sound arriving before objects are spawned.
    this.appendAwaitingSound(objectID, soundData);
    const obj = this.objectsMap.get(objectID);
    if (obj) {
      this.setObjectSound(obj, scene);
    }
  }

  static setObjectTextures(obj: BabylonObjectInterface, scene: Scene) {
    const textures = this.popAwaitingTextures(obj.objectDefinition.id);
    if (textures) {
      for (const [label, texture] of textures) {
        this.setObjectTexture(obj, scene, label, texture);
      }
    }
  }

  static setObjectTexture(
    obj: BabylonObjectInterface,
    scene: Scene,
    label: string,
    texture: Texture3dInterface
  ): void {
    // Handle object color
    if (label === 'object_color') {
      const childMeshes = obj.objectInstance.rootNodes[0].getChildMeshes();
      const basicShapeMat = childMeshes[0].material as PBRMaterial;
      basicShapeMat.albedoColor = Color3.FromHexString(texture.hash);
    } else if (label === 'object_texture') {
      if (obj.objectDefinition.asset_format.toString() === '2') {
        const childMeshes = obj.objectInstance.rootNodes[0].getChildMeshes();
        const textureUrl = this.textureRootUrl + this.textureDefaultSize + texture.hash;
        const newTexture = new Texture(
          textureUrl,
          scene,
          undefined,
          undefined,
          undefined,
          undefined,
          (message) => {
            console.log(
              'Error when loading a texture for object id: ' +
                texture.objectId +
                ', error: ' +
                message
            );
          }
        );
        newTexture.uAng = Math.PI;

        const basicShapeMat = childMeshes[0].material as PBRMaterial;
        basicShapeMat.albedoColor = Color3.White();
        basicShapeMat.albedoTexture = newTexture;
        childMeshes[0].material = basicShapeMat;
      }
    } else if (label === 'object_effect') {
      this.setObjectEffect(obj.objectDefinition.id, texture.hash);
    } else if (label === 'name') {
      // noop
    } else {
      console.debug('Unhandled object texture label: ' + label);
    }
  }

  static setObjectSound(obj: BabylonObjectInterface, scene: Scene) {
    const prevObjectSound = this.popObjectSound(obj.objectDefinition.id);
    const newSoundInfo = this.popAwaitingSound(obj.objectDefinition.id);
    const newTrack = newSoundInfo?.tracks.find((t: SoundItemInterface) => t.isActive);

    // Only distance or volume was changed
    if (newSoundInfo && prevObjectSound && prevObjectSound?.name === newTrack?.render_hash) {
      prevObjectSound.updateOptions({
        maxDistance: newSoundInfo.distance,
        volume: newSoundInfo.volume / 100
      });

      this.appendObjectSound(obj.objectDefinition.id, prevObjectSound);
      console.log('[SOUND] MAP UPD', this.objectsSoundMap);
      return;
    }

    // Stop previous sound if exists
    prevObjectSound?.dispose();

    if (newSoundInfo && newTrack) {
      const sound = new Sound(
        newTrack.render_hash,
        `${this.trackRootUrl}${newTrack.render_hash}`,
        scene,
        null,
        {
          loop: true,
          autoplay: true,
          spatialSound: true,
          skipCodecCheck: true,
          maxDistance: newSoundInfo.distance,
          volume: newSoundInfo.volume / 100
        }
      );

      const childMeshes = obj.objectInstance.rootNodes[0].getChildMeshes();
      sound.attachToMesh(childMeshes[0]);

      this.appendObjectSound(obj.objectDefinition.id, sound);
      console.log('[SOUND] MAP', this.objectsSoundMap);
    }
  }

  static instantiateObject(container: AssetContainer, object: Object3dInterface, attach: boolean) {
    const instance = container.instantiateModelsToScene();
    const node = instance.rootNodes[0];
    if (!(node instanceof TransformNode)) {
      console.log(
        'instance.rootNodes.length === 0. Something went wrong with loading ' + object.asset_3d_id
      );
      return;
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

    const babylonObject = {
      container: container,
      objectDefinition: object,
      objectInstance: instance
    };
    this.objectsMap.set(object.id, babylonObject);

    this.setObjectTextures(babylonObject, this.scene);
    this.setObjectSound(babylonObject, this.scene);

    const effect = this.awaitingEffectsMap.get(object.id);
    if (effect) {
      this.setObjectEffect(object.id, effect);
      this.awaitingEffectsMap.delete(object.id);
    }

    if (attach) {
      this.attachToCamera(object.id, node);
    }
  }

  static attachToCamera(objectId: string, node: TransformNode) {
    if (this.selectedObjectFromSpawn === '') {
      this.attachedNode = node;
      node.setParent(PlayerHelper.getPlayerNode());

      console.log('node bounding box:', node.getHierarchyBoundingVectors());
      const {size} = getBoundingInfo(node);
      console.log('size:', size);

      // node.position = new Vector3(0, -0.5, -3);
      node.position = new Vector3(0, 0, -size * 2);

      this.setSpawningMaterial(node);

      this.selectedObjectFromSpawn = objectId;
      this.transformSubscription = WorldCreatorHelper.subscribeForTransformUpdates(
        objectId,
        node,
        true
      );
    }
  }

  static detachFromCamera() {
    this.transformSubscription?.unsubscribe();

    if (this.attachedNode) {
      this.attachedNode.setParent(null, undefined, true);
      const attachedNodeChildren = this.attachedNode.getChildMeshes();
      attachedNodeChildren.forEach((element) => {
        element.setEnabled(true);
      });
      this.attachedNode.setEnabled(true);
    }

    this.mySpawningClone?.dispose();

    const obj = this.objectsMap.get(this.selectedObjectFromSpawn);
    if (obj && obj.effect && obj.effect !== EffectsEnum.NONE) {
      this.setObjectEffect(this.selectedObjectFromSpawn, obj.effect, true);
    }

    this.selectedObjectFromSpawn = '';

    PlayerHelper.setSelfPos(new Vector3(0, -0.5, -3));
  }

  static setSpawningMaterial(node: TransformNode) {
    const myClone = node.clone('clone', PlayerHelper.playerInstance.rootNodes[0]);
    const spawningMat = new PBRMaterial('spawning', this.scene);
    spawningMat.albedoColor = Color3.Gray();
    spawningMat._reflectivityColor = Color3.Gray();
    spawningMat.alpha = 0.3;

    if (myClone) {
      const cloneChildren = myClone.getChildMeshes();
      cloneChildren.forEach((element) => {
        element.material = spawningMat;
      });
    }
    this.mySpawningClone = myClone;

    const childMeshes = node.getChildMeshes();
    childMeshes.forEach((element) => {
      element.setEnabled(false);
    });
  }

  static objectEffectChange(objectId: string, effect: string) {
    const obj = this.objectsMap.get(objectId);
    if (obj) {
      this.setObjectEffect(objectId, effect);
    } else if (effect) {
      this.awaitingEffectsMap.set(objectId, effect);
    }
  }

  static setObjectEffect(objectId: string, effect: string, force = false) {
    console.log('setObjectEffect', objectId, effect);
    const obj = this.objectsMap.get(objectId);
    if (!obj) {
      console.log('setObjectEffect: object not found:', objectId, this.objectsMap);
      return;
    }

    if (effect === EffectsEnum.NONE) {
      if (!obj.cloneWithEffect) {
        return;
      }
      console.log('setObjectEffect: removing effect');
      obj.cloneWithEffect.dispose();
      obj.cloneWithEffect = undefined;
      obj.effect = undefined;

      // make sure the object is visible
      const childMeshes = obj.objectInstance.rootNodes[0].getChildMeshes();
      childMeshes.forEach((element) => {
        element.setEnabled(true);
      });
      console.log('setObjectEffect: original object is visible');
    } else if (effect === EffectsEnum.TRANSPARENT) {
      if (obj.effect === effect && !force) {
        return;
      }
      if (obj.cloneWithEffect) {
        obj.cloneWithEffect.dispose();
      }

      const node = obj.objectInstance.rootNodes[0];
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

      obj.cloneWithEffect = clone;
      obj.effect = effect;

      const childMeshes = node.getChildMeshes();
      childMeshes.forEach((element) => {
        element.setEnabled(false);
      });
      console.log('setObjectEffect: original object is hidden');
    } else {
      console.log('setObjectEffect: unknown effect:', effect);
    }
  }

  static removeObject(id: string) {
    const objToRemove = this.objectsMap.get(id);
    if (objToRemove) {
      objToRemove.objectInstance.dispose();
      objToRemove.container.removeAllFromScene();
      objToRemove.container.dispose();

      this.objectsMap.delete(id);
    } else {
      console.log("unable to delete object, as the id doesn't exist in the map, " + id);
    }
  }

  static disposeAllObjects() {
    for (const mapObj of this.objectsMap) {
      mapObj[1]?.objectInstance.dispose();
      mapObj[1]?.container.removeFromScene();
      mapObj[1]?.container.dispose();
      mapObj[1]?.cloneWithEffect?.dispose();
    }
    this.objectsMap.clear();

    for (const mapObj of this.objectsSoundMap) {
      mapObj[1].dispose();
    }
    this.objectsSoundMap.clear();
  }

  /** Append texture to the queue waiting for the object to spawn. */
  static appendAwaitingTexture(texture: Texture3dInterface): void {
    const objectID = texture.objectId;
    let current = this.awaitingTexturesMap.get(objectID);
    if (!current) {
      current = new Map();
      this.awaitingTexturesMap.set(objectID, current);
    }
    current.set(texture.label, texture);
  }

  /** Pop entry from the queue with waiting textures. */
  static popAwaitingTextures(objectID: string): SlotTexturesType | undefined {
    // pff, why is map.pop not available by default...
    const current = this.awaitingTexturesMap.get(objectID);
    if (current) {
      this.awaitingTexturesMap.delete(objectID);
    }
    return current;
  }

  /** Append sound to the queue waiting for the object to spawn. */
  static appendAwaitingSound(objectID: string, soundData: ObjectSoundInterface): void {
    const current = this.awaitingSoundMap.get(objectID);
    if (!current) {
      this.awaitingSoundMap.set(objectID, soundData);
    }
  }

  /** Pop entry from the queue with waiting sound */
  static popAwaitingSound(objectID: string): ObjectSoundInterface | undefined {
    const current = this.awaitingSoundMap.get(objectID);
    if (current) {
      this.awaitingSoundMap.delete(objectID);
    }
    return current;
  }

  /** Append the Sound entry to the map */
  static appendObjectSound(objectID: string, sound: Sound): void {
    const current = this.objectsSoundMap.get(objectID);
    if (!current) {
      this.objectsSoundMap.set(objectID, sound);
    }
  }

  /** Pop the Sound entry from the map */
  static popObjectSound(objectID: string): Sound | undefined {
    const current = this.objectsSoundMap.get(objectID);
    if (current) {
      this.objectsSoundMap.delete(objectID);
    }
    return current;
  }
}
