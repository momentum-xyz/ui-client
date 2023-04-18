import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  CubeTexture,
  PhotoDome,
  Texture,
  Color3
} from '@babylonjs/core';

export class SkyboxHelper {
  static defaultSkyboxTextureSize = 's8';

  static setCubemapSkybox(scene: Scene, url: string): void {
    const skybox = MeshBuilder.CreateBox('skyBox', {size: 1000.0}, scene);
    const skyboxMaterial = new StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(
      //'//www.babylonjs.com/assets/skybox/TropicalSunnyDay',
      //26485e74acb29223ba7a9fa600d36c7f
      url,
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;
  }

  static set360Skybox(scene: Scene, url: string): void {
    const dome = new PhotoDome(
      'testdome',
      url,
      //medusas,
      {
        resolution: 32,
        size: 10000
      },
      scene
    );
    dome.mesh.isPickable = false;
  }
}
