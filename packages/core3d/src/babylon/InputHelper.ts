import {AbstractMesh, ActionManager, ExecuteCodeAction, Matrix, Scene} from '@babylonjs/core';
import {ClickPositionInterface} from '@momentum-xyz/core';

import {PlayerHelper} from './PlayerHelper';
import {UniverseBuilderHelper} from './UniverseBuilderHelper';
import {ObjectHelper} from './ObjectHelper';

export class InputHelper {
  static moveKeys = [
    'w',
    'a',
    's',
    'd',
    'q',
    'e',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight'
  ];

  static initializeUniverse(
    scene: Scene,
    onWorldClick: (objectId: string) => void | undefined,
    onUserClick: (userId: string) => void,
    onClickOutside: () => void
  ): void {
    scene.onPointerDown = function castRay() {
      PlayerHelper.camera.lockedTarget = null;
      const ray = scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        PlayerHelper.camera
      );

      const hit = scene.pickWithRay(ray);

      if (hit) {
        if (hit.pickedMesh) {
          const pickedId = hit.pickedMesh.metadata;
          // Currently worldIds === userIds, so every click on mesh will be userClick.
          if (UniverseBuilderHelper.accountsMap.has(pickedId)) {
            UniverseBuilderHelper.goToOrb(pickedId, true);
            onUserClick(pickedId);
            console.log('user');
          } else if (UniverseBuilderHelper.worldsMap.has(pickedId)) {
            UniverseBuilderHelper.goToOrb(pickedId, false);
            onWorldClick(pickedId);
            console.log('world');
          }
        } else {
          onClickOutside();
        }
      }
    };
  }

  static initializeWorld(
    scene: Scene,
    onObjectClick: (objectId: string, clickPosition: ClickPositionInterface) => void,
    onUserClick: (userId: string, clickPosition: ClickPositionInterface) => void,
    onClickOutside: () => void
  ) {
    scene.onPointerDown = function castRay() {
      const ray = scene.createPickingRay(
        scene.pointerX,
        scene.pointerY,
        Matrix.Identity(),
        PlayerHelper.camera
      );

      const lastClick = {
        x: scene.pointerX,
        y: scene.pointerY
      };
      const hit = scene.pickWithRay(ray);

      if (hit) {
        if (hit.pickedMesh) {
          // get the root parent of the picked mesh
          let parent = hit.pickedMesh;

          while (parent.parent) {
            parent = parent.parent as AbstractMesh;
          }
          console.log('clicked on object with id: ' + parent.metadata);

          if (ObjectHelper.objectsMap.has(parent.metadata)) {
            onObjectClick(parent.metadata, lastClick);
          } else if (
            PlayerHelper.playerId === parent.metadata ||
            PlayerHelper.userMap.has(parent.metadata)
          ) {
            // add wisp follow here
            onUserClick(parent.metadata, lastClick);
          }
        } else {
          onClickOutside();
        }
      }
    };
  }

  static initializePlayerControls(scene: Scene) {
    // Keyboard Input Listener
    scene.actionManager = new ActionManager(scene);
    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          //PlayerHelper.camera.speed = FAST_SPEED;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed * 2;
        } else if (evt.sourceEvent.key === '1') {
          PlayerHelper.selectedSpeed = 1;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '2') {
          PlayerHelper.selectedSpeed = 2;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '3') {
          PlayerHelper.selectedSpeed = 3;
        } else if (evt.sourceEvent.key === '4') {
          PlayerHelper.selectedSpeed = 4;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '5') {
          PlayerHelper.selectedSpeed = 5;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '6') {
          PlayerHelper.selectedSpeed = 6;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '7') {
          PlayerHelper.selectedSpeed = 7;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '8') {
          PlayerHelper.selectedSpeed = 8;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '9') {
          PlayerHelper.selectedSpeed = 9;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (evt.sourceEvent.key === '0') {
          PlayerHelper.selectedSpeed = 0.5;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        } else if (
          PlayerHelper.camera.lockedTarget !== null &&
          InputHelper.moveKeys.includes(evt.sourceEvent.key)
        ) {
          PlayerHelper.camera.lockedTarget = null;
        }
      })
    );

    scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        if (evt.sourceEvent.key === 'Shift') {
          //PlayerHelper.camera.speed = NORMAL_SPEED;
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
        }
      })
    );
  }
}
