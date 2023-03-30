import {GizmoManager, Scene, TransformNode} from '@babylonjs/core';

import {UtilityHelper} from './UtilityHelper';

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

    // Custom gizmo stuff
    /*const customMesh = MeshBuilder.CreateBox('sphere', undefined, this.gizmoManager.gizmos.rotationGizmo?.gizmoLayer.utilityLayerScene);
    customMesh.scaling = new Vector3(0.01,0.02,0.01);
    this.gizmoManager.gizmos.rotationGizmo?.xGizmo.setCustomMesh(customMesh);*/
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

  static toggleGizmo(objectId: string, on: boolean) {
    if (on) {
      this.setGizmoType(GizmoTypesEnum.Position);
      const node = UtilityHelper.getNodeFromId(objectId);

      if (node) {
        this.gizmoManager.attachToNode(node);
      }
    } else {
      this.disableAllGizmos();
    }
  }

  static tryLockObject(id: string) {
    /*if (this.lastLockedID === id) {
      return;
    }

    if (ObjectHelper.objectsMap.has(id)) {
      //console.log('clicked on an object, trying to lock');

      // TODO: This has to be moved in the setLockedObject function, alongside enabling of gizmo
      // Make sure this is called only once per object

      const myNode = this.getNodeFromId(id);
      if (myNode) {
        this.transformSubscription = this.subscribeForTransformUpdates(myNode);
      }

      //posbusclient.trylock(id);
    } else {
      this.unlockLastObject();
    }*/
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
