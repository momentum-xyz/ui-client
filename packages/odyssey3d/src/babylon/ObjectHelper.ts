import {
  Scene,
  HemisphericLight,
  MeshBuilder,
  Nullable,
  AbstractMesh,
  StandardMaterial,
  Color3,
  SceneLoader,
  Vector3,
  Engine,
  ISceneLoaderPlugin,
  EventState,
  ISceneLoaderPluginAsync
  //Tools
} from '@babylonjs/core';
//import { GLTFLoader } from '@babylonjs/loaders/glTF/2.0/glTFLoader';
import {Object3dInterface, Texture3dInterface} from '@momentum-xyz/core';
import {GLTFFileLoader} from '@babylonjs/loaders';

//import cave from '../static/models/hyperbolic_cave.glb'

export class ObjectHelper {
  static light: HemisphericLight | null = null;

  static initialize(scene: Scene, engine: Engine, initialObjects: Object3dInterface[]): void {
    /*Tools.LoadFileAsync(cave, true).then(
      (data) => {
        const assetBlob = new Blob([data]);
        const assetUrl = URL.createObjectURL(assetBlob);

        return SceneLoader.AppendAsync(assetUrl, undefined, scene, undefined, ".glb");
      }
    ).then(
      (data) => {
        const dude = data.meshes[0];
        console.log("name iss: " + dude.name);
        dude.scaling = new Vector3(0.25, 0.25, 0.25);
      }
    );*/

    importMeshTest(scene);
    appendTest(scene);
    loadTest(engine);
    importMeshAsyncTest(scene);
    importMeshAsyncPromiseTest(scene);

    this.advancedLoading();

    initialObjects.forEach((initialObject) => {
      this.spawnObject(scene, initialObject);
    });
  }

  static spawnObject(scene: Scene, object: Object3dInterface): void {
    switch (object.asset_3d_id) {
      // Type -> Sphere
      case '7e20a110-149b-4c6e-b1ab-a25cbdc066e6': {
        const options = {diameter: object.transform.scale, segments: 32};
        const sphere = MeshBuilder.CreateSphere(object.id, options, scene);

        sphere.position.x = object.transform.position.x;
        sphere.position.y = object.transform.position.y;
        sphere.position.z = object.transform.position.z;
        break;
      }
      default: {
        console.warn(`${object.asset_3d_id} is unknown asset_3d_id`);
      }
    }
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
        gltf.onCompleteObservable.add(function () {});
      }
    );
  }
}

function importMeshTest(scene: Scene) {
  // The first parameter can be used to specify which mesh to import. Here we import all meshes
  SceneLoader.ImportMesh(
    '',
    'https://playground.babylonjs.com/scenes/',
    'BoomBox.glb',
    scene,
    function (newMeshes) {
      newMeshes[0].scaling = new Vector3(100, 100, 100);
      newMeshes[0].position = new Vector3(1, 0, 0);
    }
  );
}

function appendTest(scene: Scene) {
  SceneLoader.Append(
    'https://playground.babylonjs.com/scenes/',
    'BoomBox.glb',
    scene,
    function (scene) {
      // do something with the scene
    }
  );
}

function loadTest(engine: Engine) {
  SceneLoader.Load(
    'https://playground.babylonjs.com/scenes/',
    'BoomBox.glb',
    engine,
    function (scene) {
      // do something with the scene
    }
  );
}

function importMeshAsyncTest(scene: Scene) {
  // The first parameter can be used to specify which mesh to import. Here we import all meshes
  const resultPromise = SceneLoader.ImportMeshAsync(
    '',
    'https://playground.babylonjs.com/scenes/',
    'BoomBox.glb',
    scene
  );

  // Result has meshes, particleSystems, skeletons, animationGroups and transformNodes
  resultPromise.then((result) => {
    result.meshes[0].scaling = new Vector3(100, 100, 100);
    result.meshes[0].position = new Vector3(2, 0, 0);
  });
}

async function importMeshAsyncPromiseTest(scene: Scene) {
  // The first parameter can be used to specify which mesh to import. Here we import all meshes
  const result = await SceneLoader.ImportMeshAsync(
    '',
    'https://playground.babylonjs.com/scenes/',
    'BoomBox.glb',
    scene
  );
  result.meshes[0].scaling = new Vector3(100, 100, 100);
  result.meshes[0].position = new Vector3(3, 0, 0);
}
