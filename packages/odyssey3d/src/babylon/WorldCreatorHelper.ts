import {GizmoManager, Scene} from '@babylonjs/core';

import {ObjectHelper} from './ObjectHelper';

export enum GizmoTypesEnum {
  Position,
  Rotation,
  Scale,
  BoundingBox
}

export class WorldCreatorHelper {
  static isCreatorMode = false;
  static lastLockedID = '';
  static gizmoManager: GizmoManager;

  static initialize(scene: Scene) {
    this.isCreatorMode = false;
    this.lastLockedID = '';

    // Gizmo setup
    this.gizmoManager = new GizmoManager(scene);
    this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;

    // Enable position gizmo by default
    this.setGizmoType(GizmoTypesEnum.Position);
  }

  static toggleCreatorMode() {
    this.isCreatorMode = !this.isCreatorMode;
    this.unlockLastObject();
    this.setGizmoType(GizmoTypesEnum.Position);
  }

  static tryLockObject(id: string) {
    if (this.lastLockedID === id) {
      return;
    }

    if (ObjectHelper.objectsMap.has(id)) {
      console.log('clicked on an object, trying to lock');
      //posbusclient.trylock(id);
    } else {
      this.unlockLastObject();
    }
  }

  // Called from posbusclient event
  static setLockedObject(id: string) {
    this.lastLockedID = id;
    // TODO: Figure out if this is needed here, maybe BE doesn't actually need it
    //posbusclient.unlock(this.lastSelectedID);
  }

  static unlockLastObject() {
    if (this.lastLockedID === '') {
      return;
    } else {
      //posbusclient.unlock(this.lastSelectedID);
      this.lastLockedID = '';
    }
  }

  static setGizmoType(type: GizmoTypesEnum) {
    this.disableAllGizmos();
    switch (type) {
      case GizmoTypesEnum.Position:
        this.gizmoManager.positionGizmoEnabled = true;
        break;
      case GizmoTypesEnum.Rotation:
        this.gizmoManager.rotationGizmoEnabled = true;
        break;
      case GizmoTypesEnum.Scale:
        this.gizmoManager.scaleGizmoEnabled = true;
        break;
      case GizmoTypesEnum.BoundingBox:
        this.gizmoManager.boundingBoxGizmoEnabled = true;
        break;

      default:
        break;
    }
  }

  static disableAllGizmos() {
    if (this.gizmoManager) {
      this.gizmoManager.positionGizmoEnabled = false;
      this.gizmoManager.rotationGizmoEnabled = false;
      this.gizmoManager.scaleGizmoEnabled = false;
      this.gizmoManager.boundingBoxGizmoEnabled = false;
    }
  }
}
