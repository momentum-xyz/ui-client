import {
  Scene,
  HemisphericLight,
  MeshBuilder,
  Nullable,
  AbstractMesh,
  StandardMaterial,
  Color3,
  SceneLoader
} from '@babylonjs/core';
import {Object3dInterface, Texture3dInterface} from '@momentum-xyz/core';

export class ObjectHelper {
  static light: HemisphericLight | null = null;

  static initialize(scene: Scene, initialObjects: Object3dInterface[]): void {
    initialObjects.forEach((initialObject) => {
      this.spawnObject(scene, initialObject);
    });
  }

  static addObjects(scene: Scene, objects: any) {
    //TODO: type objects
    for (const obj of objects) {
      console.log(obj);
      if (obj.asset_format === 1) {
        //gltf
        const assetId = obj.asset_type.replaceAll('-', '');
        // TODO: inject backendUrl
        const mmUrl = 'https://dev2.odyssey.ninja/api/v3/render/asset/';
        SceneLoader.AppendAsync(mmUrl, assetId, scene, () => {}, '.glb')
          .then((scene) => {
            console.log('Loaded object ', obj.id, obj.name);
            console.log(scene);
          })
          .catch((err) => {
            console.error('Could not load ', obj.id, obj.name);
          });
      }
    }
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
}
