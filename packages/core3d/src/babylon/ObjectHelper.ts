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
  Texture
} from '@babylonjs/core';
import {Object3dInterface, Texture3dInterface, SetWorldInterface} from '@momentum-xyz/core';

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
}

export class ObjectHelper {
  static assetRootUrl = '/asset/';
  static textureRootUrl = '/texture/';
  static textureDefaultSize = 's3/';
  static objectsMap = new Map<string, Nullable<BabylonObjectInterface>>();
  static scene: Scene;
  static attachedNode: TransformNode;
  static transformSubscription: {unsubscribe: () => void} | undefined;
  static selectedObjectFromSpawn = '';
  static spawningMaterial: PBRMaterial;
  static mySpawningClone: Nullable<TransformNode>;
  static awaitingTexturesMap = new Map<string, Texture3dInterface>();

  static initialize(scene: Scene, assetBaseURL: string): void {
    this.scene = scene;
    scene.useRightHandedSystem = true;

    this.assetRootUrl = `${assetBaseURL}/asset/`;
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
    this.objectsMap.set(object.id, null);

    const assetUrl = getAssetFileName(object.asset_3d_id);

    await SceneLoader.LoadAssetContainerAsync(
      this.assetRootUrl,
      assetUrl,
      scene,
      (event) => {
        // On progress callback
        //console.log(`Loading progress ${event.loaded}/${event.total}`);
      },
      '.glb'
    ).then((container) => {
      this.instantiateObject(container, object, attachToCam);
    });
  }

  static setObjectTexture(scene: Scene, texture: Texture3dInterface): void {
    if (texture.label === 'skybox_custom') {
      SkyboxHelper.set360Skybox(
        scene,
        this.textureRootUrl + SkyboxHelper.defaultSkyboxTextureSize + texture.hash
      );
      return;
    }

    // Handle textures arriving before objects are spawned.
    if (this.objectsMap.has(texture.objectId)) {
      this.awaitingTexturesMap.set(texture.objectId, texture);
    }

    // Handle object color
    if (texture.label === 'object_color') {
      const obj = this.objectsMap.get(texture.objectId);
      if (obj) {
        const childMeshes = obj.objectInstance.rootNodes[0].getChildMeshes();
        const basicShapeMat = childMeshes[0].material as PBRMaterial;
        basicShapeMat.albedoColor = Color3.FromHexString(texture.hash);
        this.awaitingTexturesMap.delete(texture.objectId);
      }
      return;
    }
    // Handle object texture
    else if (texture.label === 'object_texture') {
      const obj = this.objectsMap.get(texture.objectId);
      if (obj) {
        if (obj.objectDefinition.asset_format.toString() === '2') {
          const childMeshes = obj.objectInstance.rootNodes[0].getChildMeshes();
          const textureUrl = this.textureRootUrl + this.textureDefaultSize + texture.hash;
          const newTexture = new Texture(
            textureUrl,
            undefined,
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
          this.awaitingTexturesMap.delete(texture.objectId);
        }
      }
      return;
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

    const awaitingTexture = this.awaitingTexturesMap.get(object.id);
    if (awaitingTexture) {
      this.setObjectTexture(this.scene, awaitingTexture);
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
    }
    this.objectsMap.clear();
  }
}
