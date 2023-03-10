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
  Matrix,
  GizmoManager,
  //Mesh,
  ActionManager,
  ExecuteCodeAction,
  InstantiatedEntries
} from '@babylonjs/core';
import {Object3dInterface, Texture3dInterface} from '@momentum-xyz/core';
import {GLTFFileLoader} from '@babylonjs/loaders';

import {CameraHelper} from './CameraHelper';

interface BabylonObjectInterface {
  container: AssetContainer;
  objectDefinition: Object3dInterface;
  objectInstance: InstantiatedEntries;
}

export class ObjectHelper {
  static light: HemisphericLight | null = null;
  static assetRootUrl = 'https://odyssey.org/api/v3/render/asset/';
  static gizmoManager: GizmoManager;
  static objects: BabylonObjectInterface[] = [];

  static initialize(scene: Scene, engine: Engine, initialObjects: Object3dInterface[]): void {
    /*initialObjects.forEach((initialObject) => {
      this.spawnObject(scene, initialObject);
    });*/

    // Mouse Click Listener
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

    // Keyboard Input Listener
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger,
          parameter: 'q'
        },
        () => {
          this.disposeAllObjects();
          console.log('q button was pressed');
        }
      )
    );

    // Gizmo
    this.gizmoManager = new GizmoManager(scene);
    this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;
    //this.gizmoManager.positionGizmoEnabled = true;
    //this.gizmoManager.rotationGizmoEnabled = true;
    //this.gizmoManager.scaleGizmoEnabled = true;
  }

  static spawnObject(scene: Scene, object: Object3dInterface): void {
    const assetUrl = object.asset_3d_id.replace(/-/g, '');
    //de99ac0e0ba06446926346d3f6c854e5
    SceneLoader.LoadAssetContainer(
      this.assetRootUrl,
      assetUrl,
      scene,
      (container) => {
        this.instantiate(container, object);
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

  static instantiate(container: AssetContainer, object: Object3dInterface) {
    const entry = container.instantiateModelsToScene();

    // Change this to get only the first root node
    for (const node of entry.rootNodes) {
      node.name = object.name;
      node.position.x = object.transform.position.x;
      node.position.y = object.transform.position.y;
      node.position.z = object.transform.position.z;
      node.metadata = object.id;
      //this.gizmoManager.attachToNode(node);

      this.gizmoManager.attachableNodes?.push(node);

      const babylonObject = {container: container, objectDefinition: object, objectInstance: entry};
      this.objects.push(babylonObject);
    }

    for (const group of entry.animationGroups) {
      group.play(true);
    }
  }

  static disposeAllObjects() {
    for (const obj of this.objects) {
      obj.objectInstance.dispose();
      obj.container.removeAllFromScene();
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
