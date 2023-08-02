import {
  Scene,
  PBRMaterial,
  Color3,
  Vector3,
  Texture,
  Sound,
  Analyser,
  Engine
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
import {getBoundingInfo} from './UtilityHelper';
import {WorldCreatorHelper} from './WorldCreatorHelper';
import './initLoaderGLTF';
import {ObjectInstance} from './ObjectInstance';

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
  static objectsMap = new Map<string, ObjectInstance>();
  static objectsSoundMap = new Map<string, Sound>();
  static scene: Scene;
  static analyser: Analyser;
  static transformSubscription: {unsubscribe: () => void} | undefined;
  static selectedObjectFromSpawn = '';
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

  static enableAnalyzer() {
    this.analyser = new Analyser(this.scene);
    this.analyser.DEBUGCANVASSIZE.width = 160;
    this.analyser.DEBUGCANVASSIZE.height = 100;
    this.analyser.DEBUGCANVASPOS.x = 80;
    this.analyser.DEBUGCANVASPOS.y = 20;

    Engine.audioEngine?.connectToAnalyser(this.analyser);
    this.analyser.drawDebugCanvas();
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

    const objectInstance = new ObjectInstance(scene, object);
    try {
      await objectInstance.load();
      this.objectsMap.set(object.id, objectInstance);

      this.setObjectTextures(objectInstance, this.scene);
      this.setObjectSound(objectInstance, this.scene);

      const effect = this.awaitingEffectsMap.get(object.id);
      if (effect) {
        objectInstance.setEffect(effect);
        this.awaitingEffectsMap.delete(object.id);
      }

      if (attachToCam) {
        this.attachToCamera(object.id, objectInstance);
      }
    } catch (e) {
      console.log('Error when loading object: ' + object.id, e);
    }
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

  static setObjectTextures(obj: ObjectInstance, scene: Scene) {
    const textures = this.popAwaitingTextures(obj.objectDefinition.id);
    if (textures) {
      for (const [label, texture] of textures) {
        this.setObjectTexture(obj, scene, label, texture);
      }
    }
  }

  static setObjectTexture(
    obj: ObjectInstance,
    scene: Scene,
    label: string,
    texture: Texture3dInterface
  ): void {
    // Handle object color
    if (label === 'object_color') {
      const childMeshes = obj.getNode(true).getChildMeshes();
      const basicShapeMat = childMeshes[0].material as PBRMaterial;
      basicShapeMat.albedoColor = Color3.FromHexString(texture.hash);
    } else if (label === 'object_texture') {
      if (obj.objectDefinition.asset_format.toString() === '2') {
        const childMeshes = obj.getNode(true).getChildMeshes();
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
      obj.setEffect(texture.hash);
    } else if (label === 'name') {
      // noop
    } else {
      console.debug('Unhandled object texture label: ' + label);
    }
  }

  static setObjectSound(obj: ObjectInstance, scene: Scene) {
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

      sound.attachToMesh(obj.getNode(true));

      this.appendObjectSound(obj.objectDefinition.id, sound);
      console.log('[SOUND] MAP', this.objectsSoundMap);
    }
  }

  static attachToCamera(objectId: string, obj: ObjectInstance) {
    if (this.selectedObjectFromSpawn === '') {
      const node = obj.getNode();

      obj.setParent(PlayerHelper.getPlayerNode());

      console.log('node bounding box:', node.getHierarchyBoundingVectors());
      const {size} = getBoundingInfo(node);
      console.log('size:', size);

      // node.position = new Vector3(0, -0.5, -3);
      obj.setPosition(new Vector3(0, 0, -size * 2));

      obj.setEffect(EffectsEnum.SPAWN_PREVIEW, false);

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

    const obj = this.objectsMap.get(this.selectedObjectFromSpawn);
    obj?.setParent(null);
    obj?.setEffect(EffectsEnum.NONE);

    this.selectedObjectFromSpawn = '';

    PlayerHelper.setSelfPos(new Vector3(0, -0.5, -3));
  }

  static objectEffectChange(objectId: string, effect: string) {
    const obj = this.objectsMap.get(objectId);
    if (obj) {
      obj.setEffect(effect);
    } else if (effect) {
      this.awaitingEffectsMap.set(objectId, effect);
    }
  }

  static removeObject(id: string) {
    const objToRemove = this.objectsMap.get(id);
    if (objToRemove) {
      objToRemove.dispose();

      this.objectsMap.delete(id);

      const objSoundToRemove = this.objectsSoundMap.get(id);
      if (objSoundToRemove) {
        objSoundToRemove.dispose();
        this.objectsSoundMap.delete(id);
        console.log('[SOUND] Dispose', id);
      }
    } else {
      console.log("unable to delete object, as the id doesn't exist in the map, " + id);
    }
  }

  static disposeAllObjects() {
    for (const [, mapObj] of this.objectsMap) {
      mapObj.dispose();
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
