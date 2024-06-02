import {
  AbstractMesh,
  ActionManager,
  ExecuteCodeAction,
  Matrix,
  PointerEventTypes,
  Scene
} from '@babylonjs/core';
import {ClickPositionInterface} from '@momentum-xyz/core';
import * as GUI from '@babylonjs/gui';

import {PlayerHelper} from './PlayerHelper';
import {UniverseBuilderHelper} from './UniverseBuilderHelper';
import {ObjectHelper} from './ObjectHelper';

const createLabel = (mesh: AbstractMesh, text: string) => {
  // TODO keep it or dispose?
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  // const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(mesh, 1024, 1024, false);

  // advancedTexture.idealWidth = 200;

  const rect = new GUI.Rectangle('label');
  rect.height = '200px';
  rect.width = '300px';
  // label.alpha = 0.2;
  // color trasparent
  rect.color = 'transparent';
  rect.cornerRadius = 20;
  // label.thickness = 1;
  rect.linkOffsetY = -100;
  rect.linkOffsetX = 180;
  // label.top = '10%';
  rect.top = '50px';
  rect.zIndex = 5;
  // label.billboardMode = 7;
  // label.background = 'black';
  // label.isVisible = false;

  advancedTexture.addControl(rect);

  rect.linkWithMesh(mesh);

  const textBlock = new GUI.TextBlock();
  textBlock.text = text; // 'Hello, world!';
  textBlock.color = 'white';
  textBlock.fontSize = 24;
  textBlock.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  rect.addControl(textBlock);

  const line = new GUI.Line('line');
  line.color = 'white';
  line.lineWidth = 3;
  line.y2 = -50;
  line.x2 = -150;
  line.linkOffsetY = -20;
  // line.linkOffsetX = -120;
  advancedTexture.addControl(line);
  line.linkWithMesh(mesh);
  line.connectedControl = rect;

  const line2 = new GUI.Line('line');
  line2.color = 'white';
  line2.lineWidth = 3;
  line2.y2 = -100;
  line2.x2 = 50;
  line2.linkOffsetY = -150;
  line2.linkOffsetX = 0;
  advancedTexture.addControl(line2);
  line2.linkWithMesh(mesh);
  line2.connectedControl = rect;

  // advancedTexture.addControl(line);

  // return label;
  return advancedTexture;
};

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

  static selectedObjectId: string | null = null;
  static selectedLabel: any; //GUI.Rectangle;

  static initializeUniverse(
    scene: Scene,
    onWorldClick: (objectId: string) => void | undefined,
    onUserClick: (userId: string) => void,
    onClickOutside: () => void
  ): void {
    scene.onPointerObservable.add(({type, ...rest}, state) => {
      // console.log('POINTER EVENT', type, rest, state);
      switch (type) {
        case PointerEventTypes.POINTERMOVE: {
          const pickInfo = scene.pick(scene.pointerX, scene.pointerY, (mesh) => !!mesh?.metadata);

          if (pickInfo?.pickedMesh) {
            if (InputHelper.selectedObjectId === pickInfo.pickedMesh.metadata) {
              return;
            }

            if (InputHelper.selectedLabel) {
              InputHelper.selectedLabel.dispose();
              InputHelper.selectedLabel = null;
            }

            console.log(
              'POINTER MOVE - picked mesh:',
              pickInfo.pickedMesh,
              pickInfo.pickedMesh.metadata
            );

            InputHelper.selectedObjectId = pickInfo.pickedMesh.metadata;
            InputHelper.selectedLabel = createLabel(
              pickInfo.pickedMesh,
              'Stakes: 20\nFollowers: 25'
              // + pickInfo.pickedMesh.metadata
            );
          } else {
            if (!InputHelper.selectedLabel) {
              return;
            }
            InputHelper.selectedLabel.dispose();
            InputHelper.selectedLabel = null;
            InputHelper.selectedObjectId = null;
          }
          break;
        }
      }
    });

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
    // scene.onPointerUp = (e, pickInfo, type) => {
    //   console.log('POINTER UP', e, pickInfo, type);
    // };
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
          PlayerHelper.camera.speed = PlayerHelper.selectedSpeed;
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
