import {
  Scene,
  MeshBuilder,
  StandardMaterial,
  CubeTexture,
  PhotoDome,
  Texture,
  Color3,
  Nullable
} from '@babylonjs/core';

export class SkyboxHelper {
  static defaultSkyboxTextureSize = 's8/';
  static currentSkybox: Nullable<PhotoDome> = null;
  static currentSkyboxUrl = '';

  static setCubemapSkybox(scene: Scene, url: string): void {
    const skybox = MeshBuilder.CreateBox('skyBox', {size: 1000.0}, scene);
    const skyboxMaterial = new StandardMaterial('skyBox', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(url, scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    skybox.isPickable = false;
  }

  static set360Skybox(scene: Scene, url: string): void {
    const dome = new PhotoDome(
      'skybox',
      url,
      {
        resolution: 32,
        size: 10000
      },
      scene,
      (errorMsg) => {
        console.log('Loading skybox error: ' + errorMsg);
      }
    );
    dome.mesh.isPickable = false;
    dome.fovMultiplier = 2;
    dome.onReady = () => {
      if (this.currentSkybox !== null) {
        this.currentSkybox.mesh.dispose();
      }

      this.currentSkybox = dome;
      this.currentSkyboxUrl = url;
    };
  }
}
