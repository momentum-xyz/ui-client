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
  static setCubemapSkybox(scene: Scene): void {
    const skybox = MeshBuilder.CreateBox('skyBox', {size: 1000.0}, scene);
    const skyboxMaterial = new StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(
      '//www.babylonjs.com/assets/skybox/TropicalSunnyDay',
      scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;
  }

  static set360Skybox(scene: Scene): void {
    const dome = new PhotoDome(
      'testdome',
      'https://cdn.eso.org/images/thumb300y/ESO_Paranal_360_Marcio_Cabral_Chile_07-CC.jpg',
      {
        resolution: 32,
        size: 1000
      },
      scene
    );
    dome.mesh.isPickable = false;
  }
}
