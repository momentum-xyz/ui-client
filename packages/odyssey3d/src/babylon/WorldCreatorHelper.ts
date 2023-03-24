import {GizmoManager, Scene, TransformNode} from '@babylonjs/core';

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
  static transformSubscription: {unsubscribe: () => void} | undefined;

  static initialize(scene: Scene) {
    this.isCreatorMode = false;
    this.lastLockedID = '';
    // Gizmo setup
    this.gizmoManager = new GizmoManager(scene);
    this.gizmoManager.clearGizmoOnEmptyPointerEvent = true;
    this.setGizmoType(GizmoTypesEnum.Position);
  }

  static subscribeForTransformUpdates(node: TransformNode) {
    const updateTransformCallback = () => {
      console.log('Updated Transform: ', node.position, node.rotationQuaternion, node.scaling);
    };

    node.onAfterWorldMatrixUpdateObservable.add(updateTransformCallback);

    return {
      unsubscribe: () => {
        node.onAfterWorldMatrixUpdateObservable.removeCallback(updateTransformCallback);
      }
    };
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

      // TODO: This has to be moved in the setLockedObject function, alongside enabling of gizmo
      // Make sure this is called only once per object
      const myNode = ObjectHelper.objectsMap.get(id)?.objectInstance.rootNodes[0];
      if (myNode) {
        this.transformSubscription = this.subscribeForTransformUpdates(myNode);
      }

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

      this.transformSubscription?.unsubscribe();
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
