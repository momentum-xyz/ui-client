import {Scene, UniversalCamera, Vector3, Quaternion, TransformNode} from '@babylonjs/core';
import {
  Odyssey3dUserInterface,
  Odyssey3dUserTransformInterface,
  SetWorldInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';

import rabbit_round from '../static/rabbit_round.png';

import {
  posToVec3,
  vec3ToPos,
  smoothUserNodeTransform,
  smoothCameraTransform,
  TransformTypesEnum
} from './TransformHelper';
import {ObjectHelper} from './ObjectHelper';
// import {InteractionEffectHelper} from './InteractionEffectHelper';
import {InputHelper} from './InputHelper';
import {PlayerInstance} from './PlayerInstance';

//const NORMAL_SPEED = 0.5;
//const FAST_SPEED = 1.5;
const PLAYER_OFFSET = new Vector3(0, -0.5, 3);
export const PLAYER_OFFSET_RH = new Vector3(0, -0.5, -3);

// TODO: Set this from PosBusSelfPosMsg
const CAMERA_POS_CREATOR = new Vector3(50, 50, 150);

export const getAvatarAbsoluteUrl = (avatarHash: string) => {
  if (avatarHash.startsWith('http')) {
    return avatarHash;
  } else {
    return ObjectHelper.textureRootUrl + ObjectHelper.textureDefaultSize + avatarHash;
  }
};

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
  static userMap = new Map<string, PlayerInstance>();

  static playerInstance?: PlayerInstance;
  static playerNode?: TransformNode;

  static playerId: string;
  static playerInterface: Odyssey3dUserInterface;
  static rightHanded = false;
  static selectedSpeed = 1;
  static onSpawnParticles: (() => void) | undefined;

  static initialize({
    scene,
    canvas,
    rh,
    position = CAMERA_POS_CREATOR,
    onMove,
    onSpawnParticles
  }: {
    scene: Scene;
    canvas: HTMLCanvasElement;
    rh: boolean;
    position?: Vector3;
    onMove?: (transform: TransformNoScaleInterface) => void;
    onSpawnParticles?: () => void;
  }) {
    console.log('PlayerHelper initialize');
    this.scene = scene;
    this.rightHanded = rh;
    this.onSpawnParticles = onSpawnParticles;
    // This creates and positions a UniversalCamera camera (non-mesh)
    const camera = new UniversalCamera('UniversalCamera', position, scene);
    camera.rotationQuaternion = new Quaternion();
    //camera.speed = NORMAL_SPEED;
    camera.speed = this.selectedSpeed;
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

    InputHelper.initializePlayerControls(scene);
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

  static getPlayerNode(): TransformNode | null {
    const myNode = this.playerNode;
    console.log('PlayerHelper getPlayerNode', myNode);

    return myNode || null;
  }

  static getUserNode(userId: string): TransformNode | null {
    const userObj = this.userMap.get(userId);
    if (userObj) {
      return userObj.getNode();
    }
    console.log('PlayerHelper getUserNode: node is null or wrong type');
    return null;
  }

  static setWorld(world: SetWorldInterface, userId: string) {
    console.log('PlayerHelper setWorld', world, userId);
    this.disposeAllUsers();
    this.playerNode?.dispose();
    this.playerNode = undefined;
    this.playerInstance?.dispose();
    this.playerInstance = undefined;

    this.playerId = userId;
    // this.spawnPlayer();
  }

  static setSelfPos(pos: Vector3) {
    const node = this.getPlayerNode();
    if (!node) {
      console.log('PlayerHelper setSelfPos: node is null or wrong type');
      return;
    }
    node.position = pos;
  }

  static setInitialPosition(transform: TransformNoScaleInterface) {
    if (this.camera) {
      this.camera.position = posToVec3(transform.position);
      this.camera.rotation = posToVec3(transform.rotation);
    }
  }

  static async spawnPlayer(position?: Vector3, target?: Vector3, avatarHash?: string) {
    console.log('PlayerHelper spawnPlayer', position, target);

    // init
    const playerNode = (this.playerNode = new TransformNode('Player'));

    const playerInstance = (this.playerInstance = new PlayerInstance({
      scene: this.scene
    }));
    // classic wisp
    await playerInstance.createClassic({
      initialPosition: position,
      beams: true,
      sparks: true,
      floating: true,
      trail: true
    });
    if (avatarHash) {
      this.setPlayerAvatar(avatarHash);
    }

    // await player.createModern();
    // player.getNode().rotation.copyFrom(new Vector3(Math.PI / 16, Math.PI, Math.PI));
    // InteractionEffectHelper.setupWispTail();
    // if (avatarHash) {
    //   this.setPlayerAvatar(avatarHash);
    // }

    // 3D model wisp, TODO scale
    // PLAYER_OFFSET_RH.z = -8;
    // await player.createFromModelUrl({
    //   modelUrl: 'https://models.babylonjs.com/alien.glb',
    //   // modelUrl: 'https://dev.odyssey.ninja/api/v3/render/asset/76b66cc92edda760beeab10efafd3e4a',
    //   // modelUrl: 'https://dev.odyssey.ninja/api/v3/render/asset/0765c2a0b76d19d325a2276a5fa9e19d',
    //   playAnimations: true
    // });

    // attach to camera
    playerNode.parent = this.camera;
    playerInstance.getNode().parent = this.camera;

    // adjust position
    if (position) {
      console.log('PlayerHelper playerInstantiate: set position', position);
      this.camera.position = position;
    }
    if (target) {
      console.log('PlayerHelper playerInstantiate: set target', target);
      this.camera.target = target;
    }

    if (this.rightHanded) {
      // manually account for RH
      playerNode.scaling = new Vector3(0.5, 0.5, -0.5);
      // this.playerInstance.wisp?.setInitialPosition(PLAYER_OFFSET_RH);
      this.playerInstance.setPosition(PLAYER_OFFSET_RH);
      playerNode.rotation = new Vector3(Math.PI / 16, Math.PI, Math.PI);
    } else {
      // this.playerInstance.wisp?.setInitialPosition(PLAYER_OFFSET);
      this.playerInstance.setPosition(PLAYER_OFFSET);
      playerNode.position = PLAYER_OFFSET;
      playerNode.rotation = new Vector3(-Math.PI / 16, Math.PI, Math.PI);
    }
  }
  static setPlayerAvatar(avatarHash: string) {
    console.log('PlayerHelper setPlayerAvatar', avatarHash);
    this.playerInstance?.updateAvatar(getAvatarAbsoluteUrl(avatarHash));
  }

  static onRender() {
    if (this.scene.deltaTime) {
      this.playerInstance?.onRender();
    }
  }

  static async userEnteredAsync(user: Odyssey3dUserInterface) {
    console.log('PlayerHelper userEnteredAsync', user);
    if (user.id === this.playerId) {
      console.log('PlayerHelper userEnteredAsync: user is player', user);
      if (!this.playerInstance) {
        await this.spawnPlayer(undefined, undefined, user.avatar);
      }
      return;
    }

    let babylonUser = this.userMap.get(user.id);

    if (!babylonUser) {
      babylonUser = new PlayerInstance({
        scene: this.scene
      });
      await babylonUser.createClassic({
        // floating: true,
        // trail: true
        beams: true
        // sparks: true
      });
      // await babylonUser.createModern();
      // await babylonUser.createFromModelUrl({modelUrl: 'https://models.babylonjs.com/alien.glb'});

      babylonUser.setUserMetadata(user);

      this.userMap.set(user.id, babylonUser);
    }

    babylonUser.updateAvatar(user.avatar ? getAvatarAbsoluteUrl(user.avatar) : rabbit_round);
  }

  static setUserTransforms(users: Odyssey3dUserTransformInterface[]) {
    for (const user of users) {
      if (user.id === this.playerId) {
        continue;
      }
      const transformNode = this.getUserNode(user.id);

      if (!transformNode) {
        console.log('Cant set position, because the instance of user has no rootnode.');
        continue;
      }

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

  static followPlayer(idToFollow: string) {
    const userNodeToFollow = this.getUserNode(idToFollow);
    if (!userNodeToFollow) {
      console.log('Cant follow player, because the instance of user has no rootnode.');
      return;
    }
    smoothCameraTransform(
      this.camera.target,
      userNodeToFollow,
      TransformTypesEnum.Rotation,
      1000,
      this.scene
    );

    smoothCameraTransform(
      this.camera.position,
      userNodeToFollow,
      TransformTypesEnum.Position,
      2000,
      this.scene,
      true,
      true
    );
  }

  static userRemove(id: string) {
    const userToRemove = this.userMap.get(id);
    if (userToRemove) {
      userToRemove.dispose();
      this.userMap.delete(id);
    } else {
      console.log("unable to delete object, as the id doesn't exist in the map, " + id);
    }
  }

  static disposeAllUsers() {
    for (const [, userToRemove] of this.userMap) {
      userToRemove.dispose();
    }
    this.userMap.clear();
  }
}
