import {
  Scene,
  HemisphericLight,
  AbstractMesh,
  SceneLoader,
  Engine,
  AssetContainer,
  Matrix,
  Mesh,
  InstantiatedEntries,
  Behavior,
  TransformNode,
  Observable,
  Texture,
  PBRMaterial
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import {Object3dInterface, Texture3dInterface} from '@momentum-xyz/core';
//import {GLTFFileLoader} from '@babylonjs/loaders';

import {CameraHelper} from './CameraHelper';
import {SkyboxHelper} from './SkyboxHelper';
import {WorldCreatorHelper} from './WorldCreatorHelper';

interface BabylonObjectInterface {
  container: AssetContainer;
  objectDefinition: Object3dInterface;
  objectInstance: InstantiatedEntries;
}

class CustomNode extends TransformNode {
  public onSomeChange = new Observable();
}

export class ObjectHelper {
  static light: HemisphericLight | null = null;
  static assetRootUrl = 'https://dev2.odyssey.ninja/api/v3/render/asset/';
  static textureRootUrl = 'https://dev2.odyssey.ninja/api/v3/render/texture/';
  static textureDefaultSize = 's3/';
  static objectsMap = new Map<string, BabylonObjectInterface>();
  static followObjectBehaviour: Behavior<InstantiatedEntries>;
  static player: TransformNode;
  static firstID: string;
  static scene: Scene;
  static mySphere: Mesh;

  static initialize(
    scene: Scene,
    engine: Engine,
    initialObjects: Object3dInterface[],
    view: HTMLCanvasElement
  ): void {
    /*initialObjects.forEach((initialObject) => {
      this.spawnObject(scene, initialObject);
    });*/
    this.scene = scene;
    this.firstID = '';
    // Mouse Click Listener
    scene.onPointerDown = function castRay() {
      const ray = scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        CameraHelper.camera
      );

      const hit = scene.pickWithRay(ray);

      if (hit) {
        if (hit.pickedMesh) {
          // get the root parent of the picked mesh
          let parent = hit.pickedMesh;
          while (parent.parent) {
            parent = parent.parent as AbstractMesh;
          }
          // For testing, fix this later
          if (!WorldCreatorHelper.isCreatorMode) {
            WorldCreatorHelper.tryLockObject(parent.metadata);
          }
          // feclient.sendclick(parent.metadata);
          console.log(parent.metadata);
        } else {
          WorldCreatorHelper.unlockLastObject();
        }
      }
    };
  }

  static setWorld(assetID: string) {
    const assetUrl = this.getAssetFileName(assetID);
    console.log('assetID is: ' + assetUrl);
  }

  static async spawnObjectAsync(scene: Scene, object: Object3dInterface) {
    const assetUrl = this.getAssetFileName(object.asset_3d_id);

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
      this.instantiate(container, object);
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

  static instantiate(container: AssetContainer, object: Object3dInterface) {
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

    const node = instance.rootNodes[0] as CustomNode;
    node.name = object.name;

    node.onSomeChange = new Observable();
    node.onSomeChange.add((data) => {
      console.log(`onSomeChange notified with data: ${data}`);
    });

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

    // Attach gizmo to object when clicked
    WorldCreatorHelper.gizmoManager.attachableNodes?.push(node);

    // Play animations
    for (const group of instance.animationGroups) {
      group.play(true);
    }

    node.onSomeChange.notifyObservers('onSomeChange');
  }

  static disposeAllObjects() {
    for (const mapObj of this.objectsMap) {
      mapObj[1].objectInstance.dispose();
      mapObj[1].container.removeFromScene();
    }
    this.objectsMap.clear();
  }

  static deleteObject(id: string) {
    const objToDelete = this.objectsMap.get(id);
    if (objToDelete) {
      objToDelete.objectInstance.dispose();
      objToDelete.container.removeAllFromScene();
      this.objectsMap.delete(id);
    } else {
      console.log("unable to delete object, as the id doesn't exist in the map, " + id);
    }
  }

  static advancedLoading(): void {
    /*SceneLoader.OnPluginActivatedObservable.addOnce(
      (loader: ISceneLoaderPlugin | ISceneLoaderPluginAsync, eventState: EventState) => {
        // This is just a precaution as this isn't strictly necessary since
        // the only loader in use is the glTF one.
        if (loader.name !== 'gltf') {
          return;
        }

        const gltf = loader as GLTFFileLoader;

        gltf.loggingEnabled = true;

        // Use HTTP range requests to load the glTF binary (GLB) in parts.
        gltf.useRangeRequests = true;

        // Register for when extension are loaded.
        gltf.onExtensionLoadedObservable.add(function (extension) {
          // Ignore extensions except MSFT_lod.
          if (extension.name !== 'MSFT_lod') {
            return;
          }
        });

        // Update the status text when loading is complete, i.e. when
        // all the LODs are loaded.
        gltf.onCompleteObservable.add(function () {
          console.log('asset loaded');
        });
      }
    );*/
  }

  static getAssetFileName(id: string): string {
    return id.replace(/-/g, '');
  }
}
