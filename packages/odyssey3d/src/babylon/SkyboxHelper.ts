import {Scene, MeshBuilder, StandardMaterial, CubeTexture, Texture, Color3} from '@babylonjs/core';

export class SkyboxHelper {
  static setSkybox(scene: Scene): void {
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
}
