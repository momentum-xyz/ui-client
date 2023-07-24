import {
  Scene,
  Vector3,
  SceneLoader,
  AssetContainer,
  InstantiatedEntries,
  NodeMaterial,
  Texture,
  TransformNode,
  SpriteManager
} from '@babylonjs/core';
import {Odyssey3dUserInterface} from '@momentum-xyz/core';

import defaultAvatar from '../static/Rabbit.png';
import wispNodeMaterial from '../static/nodeMaterialWisp.json';
import wispGlb from '../static/Wisp.glb';

import {PLAYER_OFFSET_RH} from './PlayerHelper';
import {Whisp} from './Whisp';

export class PlayerInstance {
  scene: Scene;
  container?: AssetContainer;
  userInstance?: InstantiatedEntries;
  wisp?: Whisp;

  constructor({scene}: {scene: Scene}) {
    this.scene = scene;
  }

  dispose() {
    this.userInstance?.dispose();
    this.container?.removeAllFromScene();
    this.container?.dispose();
    this.wisp?.dispose();
  }

  getNode(): TransformNode {
    const myNode = this.userInstance?.rootNodes[0] || this.wisp?.getInnerNode();
    return myNode as TransformNode;
  }

  createClassic({
    initialPosition,
    beams = false,
    sparks = false,
    floating = false,
    trail = false
  }: {
    initialPosition?: Vector3;
    beams?: boolean;
    sparks?: boolean;
    floating?: boolean;
    trail?: boolean;
  } = {}) {
    this.wisp = new Whisp(this.scene, trail, floating, beams, sparks, initialPosition);
  }

  async createFromModelUrl(
    modelUrl: string,
    rotation?: Vector3,
    scaling = new Vector3(0.5, 0.5, -0.5)
  ) {
    return SceneLoader.LoadAssetContainerAsync(modelUrl, '', this.scene, (event) => {}, '.glb')
      .then((container) => {
        this.container = container;

        const instance = container.instantiateModelsToScene();
        const userNode = instance.rootNodes[0];
        if (!(userNode instanceof TransformNode)) {
          throw new Error('Unable to instantiate user');
        }
        this.userInstance = instance;

        // setup position and rotation

        userNode.scaling = scaling;
        const childNodes = userNode.getChildTransformNodes();
        if (childNodes.length > 0) {
          childNodes[0].position = PLAYER_OFFSET_RH;
          if (rotation) {
            childNodes[0].rotation = rotation;
            // childNodes[0].rotation = new Vector3(0, Math.PI, Math.PI);
          }
        }
      })
      .catch((err) => {
        console.log('PlayerHelper userInstantiate: error', err);
      });
  }

  async createModern() {
    await this.createFromModelUrl(wispGlb);

    const userNode = this.getNode();
    const meshes = userNode.getChildMeshes();
    const customNodeMat = NodeMaterial.Parse(wispNodeMaterial, this.scene);
    const textures = customNodeMat.getTextureBlocks();
    const defaultTexture = new Texture(defaultAvatar);
    defaultTexture.vScale = -1;
    textures[2].texture = defaultTexture;
    meshes[0].material = customNodeMat;
  }

  updateAvatar(url: string) {
    console.log('updateAvatar', url);
    if (this.userInstance) {
      const meshes = this.userInstance.rootNodes[0].getChildMeshes();
      const myNodeMat = meshes[0].material as NodeMaterial;
      const textureBlocks = myNodeMat.getTextureBlocks();

      const avatarTexture = new Texture(
        url
        // undefined,
        // undefined,
        // undefined,
        // undefined,
        // undefined,
        // (message) => {
        //   console.log(
        //     'Error when loading a texture for user: ' + user.name + ', error: ' + message
        //   );
        // }
      );
      avatarTexture.vScale = -1;
      textureBlocks[2].texture = avatarTexture;
    } else if (this.wisp) {
      this.wisp.setAvatarTexture(url);
    }
  }

  // not used, for example only
  setAvatarSprite(textureUrl: string) {
    console.log('setAvatarSprite', textureUrl, 'instanciate sprite manager');
    const spriteManager = new SpriteManager(
      'AvatarManager',
      // rabbit_round,
      textureUrl,
      1,
      {
        width: 128,
        height: 128
        // width: 512,
        // height: 512
      },
      this.scene
    );
    console.log('loadAvatar', this.wisp, spriteManager);
    this.wisp?.setAvatar(spriteManager);
  }

  setUserMetadata(userDefinition: Odyssey3dUserInterface) {
    const userNode = this.getNode();
    const {id, name} = userDefinition;
    userNode.name = name;
    userNode.metadata = id;
  }
}
