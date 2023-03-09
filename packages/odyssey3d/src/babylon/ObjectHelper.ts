import {
  Scene,
  HemisphericLight,
  Nullable,
  AbstractMesh,
  StandardMaterial,
  Color3,
  SceneLoader,
  Engine,
  ISceneLoaderPlugin,
  EventState,
  ISceneLoaderPluginAsync,
  AssetContainer,
  float,
  Matrix
} from '@babylonjs/core';
import {Object3dInterface, Texture3dInterface} from '@momentum-xyz/core';
import {GLTFFileLoader} from '@babylonjs/loaders';

import {CameraHelper} from './CameraHelper';

export class ObjectHelper {
  static light: HemisphericLight | null = null;
  static assetRootUrl = 'https://odyssey.org/api/v3/render/asset/';

  static initialize(scene: Scene, engine: Engine, initialObjects: Object3dInterface[]): void {
    /*initialObjects.forEach((initialObject) => {
      this.spawnObject(scene, initialObject);
    });*/

    scene.onPointerDown = function castRay() {
      const ray = scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        // Is this legal?
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
          console.log(parent.metadata);
        }
      }
    };
  }

  static spawnObject(scene: Scene, object: Object3dInterface): void {
    const assetUrl = object.asset_3d_id.replace(/-/g, '');
    //de99ac0e0ba06446926346d3f6c854e5
    SceneLoader.LoadAssetContainer(
      this.assetRootUrl,
      assetUrl,
      scene,
      (container) => {
        this.instantiate(
          container,
          object.transform.position.x,
          object.transform.position.y,
          object.transform.position.z,
          object.name,
          object.id
        );
      },
      (event) => {
        // On progress callback
        console.log(`Loading progress ${event.loaded}/${event.total}`);
      },
      (scene, message) => {
        // On error callback
        console.log(object.name + ' failed loading!: ' + message);
      },
      '.glb'
    );
  }

  static setObjectTexture(scene: Scene, texture: Texture3dInterface): void {
    const mesh: Nullable<AbstractMesh> = scene.getMeshById(texture.objectId);
    if (mesh && texture.textureColor) {
      const material = new StandardMaterial('color', scene);
      material.alpha = 1;
      material.diffuseColor = Color3.FromHexString(texture.textureColor).toLinearSpace();
      mesh.material = material;
    }
  }

  static instantiate(
    container: AssetContainer,
    x: float,
    y: float,
    z: float,
    name: string,
    id: string
  ) {
    const entries = container.instantiateModelsToScene();

    for (const node of entries.rootNodes) {
      node.name = name;
      node.position.x = x;
      node.position.y = y;
      node.position.z = z;
      node.metadata = id;
    }

    for (const group of entries.animationGroups) {
      group.play(true);
    }
  }

  static advancedLoading(): void {
    SceneLoader.OnPluginActivatedObservable.addOnce(
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
    );
  }
}
