import {
  Scene,
  UniversalCamera,
  Vector3,
  Quaternion,
  SceneLoader,
  AssetContainer,
  ActionManager,
  ExecuteCodeAction,
  InstantiatedEntries,
  NodeMaterial,
  Texture,
  TransformNode
} from '@babylonjs/core';
import {
  Odyssey3dUserInterface,
  Odyssey3dUserTransformInterface,
  SetWorldInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';

import wisp from '../static/Wisp.glb';
import defaultAvatar from '../static/Rabbit.png';
import wispNodeMaterial from '../static/nodeMaterialWisp.json';

import {
  posToVec3,
  vec3ToPos,
  smoothUserNodeTransform,
  smoothCameraTransform,
  TransformTypesEnum
} from './TransformHelper';
//import {InteractionEffectHelper} from './InteractionEffectHelper';

const NORMAL_SPEED = 0.5;
const FAST_SPEED = 1.5;
const PLAYER_OFFSET = new Vector3(0, -0.5, 3);
export const PLAYER_OFFSET_RH = new Vector3(0, -0.5, -3);

// TODO: Set this from PosBusSelfPosMsg
const CAMERA_POS = new Vector3(50, 50, 150);

interface BabylonUserInterface {
  container: AssetContainer;
  userDefinition: Odyssey3dUserInterface;
  userInstance: InstantiatedEntries;
}

const enum KeysEnum {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,

  A = 65,
  D = 68,
  E = 69,
  Q = 81,
  S = 83,
  W = 87
}

export class PlayerHelper {
  static camera: UniversalCamera;
  static scene: Scene;
  static userMap = new Map<string, BabylonUserInterface>();

  static playerInstance: InstantiatedEntries;
  static playerAvatar3D: string;
  static playerId: string;
  static playerInterface: Odyssey3dUserInterface;
  static rightHanded = false;
  static onSpawnParticles: (() => void) | undefined;

  static initialize(
    scene: Scene,
    canvas: HTMLCanvasElement,
    rh: boolean,
    onMove?: (transform: TransformNoScaleInterface) => void,
    onSpawnParticles?: () => void
  ) {
    this.scene = scene;
    this.rightHanded = rh;
    this.onSpawnParticles = onSpawnParticles;
    // This creates and positions a UniversalCamera camera (non-mesh)
    const camera = new UniversalCamera('UniversalCamera', CAMERA_POS, scene);
    camera.rotationQuaternion = new Quaternion();
    camera.speed = NORMAL_SPEED;
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // WASD controls
    camera.keysUp = [KeysEnum.W, KeysEnum.UP];
    camera.keysLeft = [KeysEnum.A, KeysEnum.LEFT];
    camera.keysDown = [KeysEnum.S, KeysEnum.DOWN];
    camera.keysRight = [KeysEnum.D, KeysEnum.RIGHT];
    camera.keysUpward = [KeysEnum.E];
    camera.keysDownward = [KeysEnum.Q];

    this.camera = camera;

    // Keyboard Input Listener
    // TODO: Move Action Manager and Key Input to some central place to be used from different scripts
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          PlayerHelper.camera.speed = FAST_SPEED;
        }

        if (evt.sourceEvent.key === 'q') {
          //InteractionEffectHelper.startParticles(new Vector3(0, 0, 0));
          PlayerHelper.followPlayer('a');
        }
      })
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          PlayerHelper.camera.speed = NORMAL_SPEED;
        }
      })
    );

    this.camera.onViewMatrixChangedObservable.add(() => {
      // TODO: Consider where to apply the offset between player and camera

      const playerTransform: TransformNoScaleInterface = {
        position: vec3ToPos(this.camera.position /*.add(PLAYER_OFFSET)*/),
        rotation: vec3ToPos(this.camera.rotation)
      };

      if (onMove) {
        onMove(playerTransform);
      }
    });
  }

  static setWorld(world: SetWorldInterface, userId: string) {
    this.playerAvatar3D = world.avatar_3d_asset_id;
    this.playerId = userId;
    this.spawnPlayer(PlayerHelper.scene);
  }

  static setSelfPos(pos: Vector3) {}

  // TODO: Consider merging the different spawning functions
  static spawnPlayer(scene: Scene) {
    // TODO: Commented out the actual line, as currently the assetID coming from BE is a Unity asset, so doesn't load
    //const assetUrl = getAssetFileName(PlayerHelper.playerAvatar3D);
    //const assetUrl = getAssetFileName('d906e070-3d2e-b1a5-3e3f-703423225945');

    SceneLoader.LoadAssetContainer(
      wisp, //ObjectHelper.assetRootUrl,
      '', //assetUrl,
      scene,
      (container) => {
        this.playerInstantiate(container);
      },
      //on progress
      (event) => {},
      (scene, message) => {
        // On error callback
        console.log(PlayerHelper.playerAvatar3D + ' failed loading!: ' + message);
      },
      '.glb'
    );
  }

  // TODO: Consider merging the different instantiating functions
  static playerInstantiate(container: AssetContainer) {
    const instance = container.instantiateModelsToScene();

    if (instance.rootNodes.length === 0) {
      console.log('instance.rootNodes.length === 0 when spawning player');
      return;
    }

    // TODO: Set camera pos
    const playerNode = instance.rootNodes[0];
    this.setUserAvatar(playerNode);

    playerNode.name = 'Player';
    playerNode.parent = this.camera;
    playerNode.rotation = new Vector3(0, 0, 0);
    playerNode.scaling = new Vector3(0.5, 0.5, 0.5);

    if (this.rightHanded) {
      // manually account for RH
      playerNode.scaling = new Vector3(0.5, 0.5, -0.5);
      playerNode.position = PLAYER_OFFSET_RH;
      playerNode.rotation = new Vector3(Math.PI / 16, Math.PI, Math.PI);
    } else {
      playerNode.position = PLAYER_OFFSET;
      playerNode.rotation = new Vector3(-Math.PI / 16, Math.PI, Math.PI);
    }
    // Animations
    for (const group of instance.animationGroups) {
      console.log('animation group name: ' + group.name);
      //group.play(true);
    }
    instance.animationGroups[4].loopAnimation = true;
    instance.animationGroups[4].play();

    this.playerInstance = instance;
  }

  static setUserAvatar(node: TransformNode) {
    const meshes = node.getChildMeshes();
    const customNodeMat = NodeMaterial.Parse(wispNodeMaterial, this.scene);
    const textures = customNodeMat.getTextureBlocks();
    const defaultTexture = new Texture(defaultAvatar);
    textures[2].texture = defaultTexture;
    meshes[0].material = customNodeMat;
  }

  static updateUserAvatar(user: Odyssey3dUserInterface, instance: InstantiatedEntries) {
    const meshes = instance.rootNodes[0].getChildMeshes();
    const myNodeMat = meshes[0].material as NodeMaterial;
    const textureBlocks = myNodeMat.getTextureBlocks();
    if (user.avatar) {
      const avatarTexture = new Texture(user.avatar);
      textureBlocks[2].texture = avatarTexture;
    }
  }

  static async userEnteredAsync(user: Odyssey3dUserInterface) {
    //console.log('user avatar: ' + user.avatar);
    await this.spawnUserAsync(this.scene, user);
  }

  // TODO: Consider merging the different spawning functions
  static async spawnUserAsync(scene: Scene, user: Odyssey3dUserInterface) {
    // TODO: Commented out the actual line, as currently the assetID coming from BE is a Unity asset, so doesn't load
    //const assetUrl = getAssetFileName(this.playerAvatar3D);
    //const assetUrl = getAssetFileName('d906e070-3d2e-b1a5-3e3f-703423225945');

    await SceneLoader.LoadAssetContainerAsync(
      wisp, //ObjectHelper.assetRootUrl,
      '', //assetUrl,
      scene,
      (event) => {
        // On progress callback
        //console.log(`Loading progress ${event.loaded}/${event.total}`);
      },
      '.glb'
    ).then((container) => {
      this.userInstantiate(container, user);
    });
  }

  static userInstantiate(container: AssetContainer, user: Odyssey3dUserInterface) {
    if (user.id === this.playerId) {
      this.playerInterface = user;
      if (this.playerInstance) {
        this.updateUserAvatar(user, this.playerInstance);
      }
      return;
    } else {
      const instance = container.instantiateModelsToScene();
      if (instance.rootNodes.length === 0) {
        console.log('instance.rootNodes.length === 0 when spawning player');
        return;
      }

      const userNode = instance.rootNodes[0];
      this.setUserAvatar(userNode);

      userNode.scaling = new Vector3(0.5, 0.5, -0.5);
      const childNodes = userNode.getChildTransformNodes();
      if (childNodes.length > 0) {
        childNodes[0].position = PLAYER_OFFSET_RH;
        childNodes[0].rotation = new Vector3(0, Math.PI, Math.PI);
      }

      userNode.name = user.name;
      if (user.transform?.position) {
        userNode.position = posToVec3(user.transform.position);
      }

      userNode.metadata = user.id;

      const babylonUser = {
        container: container,
        userDefinition: user,
        userInstance: instance
      };
      this.userMap.set(user.id, babylonUser);
      this.updateUserAvatar(user, instance);
    }
  }

  static setUserTransforms(users: Odyssey3dUserTransformInterface[]) {
    for (const user of users) {
      if (user.id === this.playerId) {
        continue;
      }
      const userObj = this.userMap.get(user.id);

      if (userObj) {
        if (userObj.userInstance.rootNodes.length === 0) {
          console.log('Cant set position, because the instance of user has no rootnode.');
          continue;
        }
        const transformNode = userObj.userInstance.rootNodes[0];

        smoothUserNodeTransform(
          transformNode,
          transformNode.position,
          user.transform.position,
          TransformTypesEnum.Position,
          this.scene
        );

        smoothUserNodeTransform(
          transformNode,
          transformNode.rotation,
          user.transform.rotation,
          TransformTypesEnum.Rotation,
          this.scene
        );
      }
    }
  }

  static followPlayer(idToFollow: string) {
    // TODO: Replace lastJoinedID with idToFollow when FE is there
    const userToFollow = this.userMap.get(idToFollow);
    if (userToFollow) {
      const userNodeToFollow = userToFollow.userInstance.rootNodes[0];

      smoothCameraTransform(
        this.camera.target,
        userNodeToFollow,
        TransformTypesEnum.Rotation,
        500,
        this.scene
      );

      smoothCameraTransform(
        this.camera.position,
        userNodeToFollow,
        TransformTypesEnum.Position,
        2000,
        this.scene,
        true
      );
    }
  }

  static userRemove(id: string) {
    const userToRemove = this.userMap.get(id);
    if (userToRemove) {
      userToRemove.userInstance.dispose();
      userToRemove.container.removeAllFromScene();
      userToRemove.container.dispose();

      this.userMap.delete(id);
    } else {
      console.log("unable to delete object, as the id doesn't exist in the map, " + id);
    }
  }

  static disposeAllUsers() {
    for (const mapObj of this.userMap) {
      mapObj[1].userInstance.dispose();
      mapObj[1].container.removeFromScene();
      mapObj[1].container.dispose();
    }
    this.userMap.clear();
  }
}
