import {
  Scene,
  UniversalCamera,
  Vector3,
  Quaternion,
  SceneLoader,
  AssetContainer,
  ActionManager,
  ExecuteCodeAction,
  InstantiatedEntries
} from '@babylonjs/core';
import {
  Odyssey3dUserInterface,
  Odyssey3dUserTransformInterface,
  SetWorldInterface,
  TransformNoScaleInterface
} from '@momentum-xyz/core';

import {ObjectHelper} from './ObjectHelper';
import {getAssetFileName, posToVec3, vec3ToPos} from './UtilityHelper';

const NORMAL_SPEED = 0.5;
const FAST_SPEED = 1.5;
const PLAYER_OFFSET = new Vector3(0, -0.5, 2);
// TODO: Set this from PosBusSelfPosMsg
const CAMERA_POS = new Vector3(50, 50, 150);

interface BabylonUserInterface {
  container: AssetContainer;
  userDefinition: Odyssey3dUserInterface;
  userInstance: InstantiatedEntries;
}

export class PlayerHelper {
  static camera: UniversalCamera;
  static playerMoveEvent: {unsubscribe: () => void} | undefined;
  static scene: Scene;
  static userMap = new Map<string, BabylonUserInterface>();

  static playerInstance: InstantiatedEntries;
  static playerAvatar3D: string;
  static playerId: string;
  static playerInterface: Odyssey3dUserInterface;

  static initialize(
    scene: Scene,
    canvas: HTMLCanvasElement,
    onMove?: (transform: TransformNoScaleInterface) => void
  ) {
    this.scene = scene;
    // This creates and positions a UniversalCamera camera (non-mesh)
    const camera = new UniversalCamera('UniversalCamera', CAMERA_POS, scene);
    camera.rotationQuaternion = new Quaternion();
    camera.speed = NORMAL_SPEED;
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // WASD controls
    camera.keysUp = [87];
    camera.keysLeft = [65];
    camera.keysDown = [83];
    camera.keysRight = [68];

    this.camera = camera;

    // Keyboard Input Listener
    // TODO: Move Action Manager and Key Input to some central place to be used from different scripts
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          PlayerHelper.camera.speed = FAST_SPEED;
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
        position: vec3ToPos(this.camera.position.subtract(PLAYER_OFFSET)),
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
    const assetUrl = getAssetFileName('d906e070-3d2e-b1a5-3e3f-703423225945');
    SceneLoader.LoadAssetContainer(
      ObjectHelper.assetRootUrl,
      assetUrl,
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
    playerNode.name = 'Player';
    playerNode.parent = this.camera;
    playerNode.position = PLAYER_OFFSET;
    playerNode.rotation = new Vector3(0, 0, 0);
    playerNode.scaling = new Vector3(1, 1, 1);

    // Animations
    for (const group of instance.animationGroups) {
      group.play(true);
    }

    this.playerInstance = instance;
  }

  static async userEnteredAsync(user: Odyssey3dUserInterface) {
    console.log('userEntered: ' + user.id);
    await this.spawnUserAsync(this.scene, user);
  }

  // TODO: Consider merging the different spawning functions
  static async spawnUserAsync(scene: Scene, user: Odyssey3dUserInterface) {
    // TODO: Commented out the actual line, as currently the assetID coming from BE is a Unity asset, so doesn't load
    //const assetUrl = getAssetFileName(this.playerAvatar3D);
    const assetUrl = getAssetFileName('d906e070-3d2e-b1a5-3e3f-703423225945');

    await SceneLoader.LoadAssetContainerAsync(
      ObjectHelper.assetRootUrl,
      assetUrl,
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
    console.log('userInstantiate with userid: ' + user.id + ', playerId: ' + this.playerId);
    if (user.id === this.playerId) {
      this.playerInterface = user;
      return;
    } else {
      const instance = container.instantiateModelsToScene();
      if (instance.rootNodes.length === 0) {
        console.log('instance.rootNodes.length === 0 when spawning player');
        return;
      }

      const userNode = instance.rootNodes[0];
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

        transformNode.position = posToVec3(user.transform.position);
        transformNode.rotation = posToVec3(user.transform.rotation);
      }
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
