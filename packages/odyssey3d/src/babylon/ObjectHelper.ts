import {
  Scene,
  HemisphericLight,
  AbstractMesh,
  SceneLoader,
  Engine,
  AssetContainer,
  Matrix,
  InstantiatedEntries,
  Texture,
  PBRMaterial
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {Object3dInterface, Texture3dInterface, ClickPositionInterface} from '@momentum-xyz/core';
//import {GLTFFileLoader} from '@babylonjs/loaders';

import {PlayerHelper} from './PlayerHelper';
import {SkyboxHelper} from './SkyboxHelper';
import {getAssetFileName} from './UtilityHelper';

interface BabylonObjectInterface {
  container: AssetContainer;
  objectDefinition: Object3dInterface;
  objectInstance: InstantiatedEntries;
}

export class ObjectHelper {
  static light: HemisphericLight | null = null;
  static assetRootUrl = 'https://dev2.odyssey.ninja/api/v3/render/asset/';
  static textureRootUrl = 'https://dev2.odyssey.ninja/api/v3/render/texture/';
  static textureDefaultSize = 's3/';
  static objectsMap = new Map<string, BabylonObjectInterface>();
  static firstID: string;
  static scene: Scene;

  static initialize(
    scene: Scene,
    engine: Engine,
    view: HTMLCanvasElement,
    onObjectClick: (objectId: string, clickPosition: ClickPositionInterface) => void,
    onUserClick: (userId: string, clickPosition: ClickPositionInterface) => void,
    onClickOutside: () => void
  ): void {
    this.scene = scene;
    this.firstID = '';
    // Mouse Click Listener
    scene.onPointerDown = function castRay() {
      const ray = scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        PlayerHelper.camera
      );

      const lastClick = {
        x: scene.pointerX,
        y: scene.pointerY
      };
      const hit = scene.pickWithRay(ray);

      if (hit) {
        if (hit.pickedMesh) {
          // get the root parent of the picked mesh
          let parent = hit.pickedMesh;
          while (parent.parent) {
            parent = parent.parent as AbstractMesh;
          }
          console.log('clicked on object with id: ' + parent.metadata);
          if (ObjectHelper.objectsMap.has(parent.metadata)) {
            onObjectClick(parent.metadata, lastClick);
          } else if (
            PlayerHelper.playerId === parent.metadata ||
            PlayerHelper.userMap.has(parent.metadata)
          ) {
            onUserClick(parent.metadata, lastClick);
          }

          // For testing, fix this later
          /*if (!WorldCreatorHelper.isCreatorMode) {
            WorldCreatorHelper.tryLockObject(parent.metadata);
          }*/
        } else {
          // WorldCreatorHelper.unlockLastObject();
          onClickOutside();
        }
      }
    };
  }

  static setWorld(assetID: string) {
    // TODO: Add logic with this assetid
    const assetUrl = getAssetFileName(assetID);
    console.log('assetID is: ' + assetUrl);
  }

  static async spawnObjectAsync(scene: Scene, object: Object3dInterface) {
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
      this.instantiateObject(container, object);
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

    const meshes = this.objectsMap.get(this.firstID)?.objectInstance.rootNodes[0].getChildMeshes();

    if (meshes) {
      for (const mesh of meshes) {
        const textureUrl = this.textureRootUrl + this.textureDefaultSize + texture.hash;
        const newTexture = new Texture(textureUrl, scene);
        // TODO: check if material can be casted as PBRMaterial
        const meshMater = mesh.material as PBRMaterial;
        meshMater.albedoTexture = newTexture;
      }
    } else {
      console.log("unable to set object texture, as the id didn't return a value from the map");
    }
  }

  static instantiateObject(container: AssetContainer, object: Object3dInterface) {
    const instance = container.instantiateModelsToScene();

    if (instance.rootNodes.length === 0) {
      console.log(
        'instance.rootNodes.length === 0. Something went wrong with loading ' + object.asset_3d_id
      );
      return;
    }

    if (instance.rootNodes.length > 1) {
      console.log(
        'instance.rootNodes.length > 1. Using only the first one from ' + object.asset_3d_id
      );
    }

    const node = instance.rootNodes[0];
    node.name = object.name;

    node.position.x = object.transform.position.x;
    node.position.y = object.transform.position.y;
    node.position.z = object.transform.position.z;
    node.metadata = object.id;
    if (this.firstID === '') {
      this.firstID = object.id;
    }
    /*const meshes = node.getChildMeshes();
    for (const mesh of meshes) {
      console.log(mesh.name);
    }*/

    const babylonObject = {
      container: container,
      objectDefinition: object,
      objectInstance: instance
    };
    this.objectsMap.set(object.id, babylonObject);

    // Play animations
    for (const group of instance.animationGroups) {
      group.play(true);
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
      mapObj[1].objectInstance.dispose();
      mapObj[1].container.removeFromScene();
      mapObj[1].container.dispose();
    }
    this.objectsMap.clear();
  }
}
