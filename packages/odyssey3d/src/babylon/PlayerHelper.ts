import {
  Scene,
  UniversalCamera,
  Vector3,
  Quaternion,
  TransformNode,
  SceneLoader,
  AssetContainer,
  ActionManager,
  ExecuteCodeAction
} from '@babylonjs/core';
import {TransformNoScaleInterface} from '@momentum-xyz/core';

import {ObjectHelper} from './ObjectHelper';
import {getAssetFileName} from './UtilityHelper';

const NORMAL_SPEED = 0.5;
const FAST_SPEED = 1.5;
const PLAYER_OFFSET = new Vector3(0, -0.5, 2);

export class PlayerHelper {
  static camera: UniversalCamera;
  static player: TransformNode;
  static playerAssetId: string;
  static playerMoveEvent: {unsubscribe: () => void} | undefined;

  static initialize(
    scene: Scene,
    canvas: HTMLCanvasElement,
    onMove: (transform: TransformNoScaleInterface) => void
  ) {
    // This creates and positions a UniversalCamera camera (non-mesh)
    const camera = new UniversalCamera('UniversalCamera', new Vector3(-5, 5, -15), scene);
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
      // Check how often data should be sent to onMove

      const playerTransform: TransformNoScaleInterface = {
        position: Vector3.Zero(),
        rotation: Vector3.Zero()
      };

      playerTransform.position = this.camera.position.subtract(PLAYER_OFFSET);
      playerTransform.rotation = this.camera.rotation;

      onMove(playerTransform);
    });
  }

  static spawnPlayer(scene: Scene, assetID: string) {
    this.playerAssetId = assetID;
    const assetUrl = getAssetFileName(assetID);
    SceneLoader.LoadAssetContainer(
      ObjectHelper.assetRootUrl,
      assetUrl,
      scene,
      (container) => {
        this.playerInstantiate(container);
      },
      (event) => {},
      (scene, message) => {
        // On error callback
        console.log(assetID + ' failed loading!: ' + message);
      },
      '.glb'
    );
  }

  static userEntered(id: string) {
    console.log('userEntered: ' + id);
  }

  static playerInstantiate(container: AssetContainer) {
    const instance = container.instantiateModelsToScene();

    if (instance.rootNodes.length === 0) {
      console.log('instance.rootNodes.length === 0 when spawning player');
      return;
    }

    instance.rootNodes[0].name = 'Player';
    this.player = instance.rootNodes[0];
    this.player.parent = this.camera;
    this.player.position = PLAYER_OFFSET;
    this.player.rotation = new Vector3(0, 0, 0);
    this.player.scaling = new Vector3(1, 1, 1);
    // Animations
    for (const group of instance.animationGroups) {
      group.play(true);
    }
  }
}
