import {
  Scene,
  HemisphericLight,
  AbstractMesh,
  StandardMaterial,
  SceneLoader,
  Engine,
  AssetContainer,
  Matrix,
  GizmoManager,
  Mesh,
  ActionManager,
  ExecuteCodeAction,
  InstantiatedEntries,
  Behavior,
  TransformNode,
  Vector3,
  Observable,
  MeshBuilder,
  Texture,
  PBRMaterial
} from '@babylonjs/core';
import {Object3dInterface, Texture3dInterface} from '@momentum-xyz/core';
//import {GLTFFileLoader} from '@babylonjs/loaders';

import {CameraHelper} from './CameraHelper';

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
  static assetRootUrl = 'https://odyssey.org/api/v3/render/asset/';
  static textureRootUrl = 'https://odyssey.org/api/v3/render/texture/'
  static textureDefaultSize = 's3/'
  static gizmoManager: GizmoManager;
  // switch from Array to Map
  static objects: BabylonObjectInterface[] = [];
  static followObjectBehaviour: Behavior<InstantiatedEntries>;
  static _camRoot: TransformNode;
  static _yTilt: TransformNode;
  static player: TransformNode;
  static idToDelete: string;
  static scene: Scene;
  static myDistance: Vector3;
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
    this.idToDelete = '';
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

          console.log("position: " + parent.position);
          console.log("rotation: " + parent.rotation);

          ObjectHelper.myDistance = parent.position;
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
          console.log('q button was pressed. all objects disposed!');
        }
      )
    );

    // Gizmo
    this.gizmoManager = new GizmoManager(scene);
    this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;
    this.gizmoManager.positionGizmoEnabled = true;
    //this.gizmoManager.rotationGizmoEnabled = true;
    //this.gizmoManager.scaleGizmoEnabled = true;

    // Testing
    document.onkeydown = (e) => {
      if (e.key === 'e') {
        this.gizmoManager.positionGizmoEnabled = !this.gizmoManager.positionGizmoEnabled;
      }
      if (e.key === 'r') {
        this.gizmoManager.rotationGizmoEnabled = !this.gizmoManager.rotationGizmoEnabled;
      }
      if (e.key === 't') {
        this.gizmoManager.scaleGizmoEnabled = !this.gizmoManager.scaleGizmoEnabled;
      }
      if (e.key === 'y') {
        //this.deleteObject(this.idToDelete);
        this.gizmoManager.boundingBoxGizmoEnabled = !this.gizmoManager.boundingBoxGizmoEnabled;
      }
    };

    this.mySphere = MeshBuilder.CreateSphere("mySphere");

    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseTexture = new Texture(this.textureRootUrl + this.textureDefaultSize + 'a7169a999da8ec5935a14a0b2669fdfc' , scene);
    this.mySphere.material = groundMat;
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
    // TODO: Get the mesh from a proper map lookup, instead of like this
    const meshes = this.objects[0].objectInstance.rootNodes[0].getChildMeshes();
    for (const mesh of meshes) {
      console.log(mesh.material?.name);
      const textureUrl = this.textureRootUrl + this.textureDefaultSize + texture.hash;
      const newTexture = new Texture(textureUrl, scene);
      // TODO: check if material can be casted as PBRMaterial
      const meshMater = mesh.material as PBRMaterial;
      meshMater.albedoTexture = newTexture;
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
    if (this.idToDelete === '') {
      this.idToDelete = object.id;
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
    this.objects.push(babylonObject);

    // Attach gizmo to object when clicked
    this.gizmoManager.attachableNodes?.push(node);

    // Play animations
    for (const group of instance.animationGroups) {
      group.play(true);
    }

    node.onSomeChange.notifyObservers('onSomeChange');
  }

  static disposeAllObjects() {
    for (const obj of this.objects) {
      obj.objectInstance.dispose();
      obj.container.removeAllFromScene();
    }
  }

  static deleteObject(id: string) {
    for (const obj of this.objects) {
      if (obj.objectDefinition.id === id) {
        obj.objectInstance.dispose();
        obj.container.removeAllFromScene();
        const index = this.objects.indexOf(obj);
        this.objects.splice(index, 1);

        console.log('object with id: ' + id + ', deleted successfully');
      }
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
