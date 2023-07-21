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

import {posToVec3} from './TransformHelper';
import {PLAYER_OFFSET_RH} from './PlayerHelper';
import {Whisp} from './Whisp';

export class PlayerInstance {
  scene: Scene;
  userDefinition: Odyssey3dUserInterface;
  container?: AssetContainer;
  userInstance?: InstantiatedEntries;
  wisp?: Whisp;

  constructor({scene, user}: {scene: Scene; user: Odyssey3dUserInterface}) {
    this.scene = scene;
    this.userDefinition = user;
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

  create() {
    this.wisp = new Whisp(this.scene);
  }

  async createFromModelUrl(modelUrl: string) {
    return SceneLoader.LoadAssetContainerAsync(
      modelUrl,
      // wisp, //ObjectHelper.assetRootUrl,
      '',
      this.scene,
      (event) => {},
      '.glb'
    )
      .then((container) => {
        this.container = container;

        const instance = container.instantiateModelsToScene();
        const userNode = instance.rootNodes[0];
        if (!(userNode instanceof TransformNode)) {
          throw new Error('Unable to instantiate user');
        }
        this.userInstance = instance;

        // setup position and rotation
        userNode.scaling = new Vector3(0.5, 0.5, -0.5);
        const childNodes = userNode.getChildTransformNodes();
        if (childNodes.length > 0) {
          childNodes[0].position = PLAYER_OFFSET_RH;
          childNodes[0].rotation = new Vector3(0, Math.PI, Math.PI);
        }

        const {id, name, transform} = this.userDefinition;
        userNode.name = name;
        if (transform?.position) {
          userNode.position = posToVec3(transform.position);
        }

        userNode.metadata = id;

        const meshes = userNode.getChildMeshes();
        const customNodeMat = NodeMaterial.Parse(wispNodeMaterial, this.scene);
        const textures = customNodeMat.getTextureBlocks();
        const defaultTexture = new Texture(defaultAvatar);
        textures[2].texture = defaultTexture;
        meshes[0].material = customNodeMat;
      })
      .catch((err) => {
        console.log('PlayerHelper userInstantiate: error', err);
      });
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
}
