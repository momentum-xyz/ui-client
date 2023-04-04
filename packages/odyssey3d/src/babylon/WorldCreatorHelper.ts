import {GizmoManager, Scene, TransformNode, Vector3} from '@babylonjs/core';
import {ObjectTransformInterface} from '@momentum-xyz/core';

import {getNodeFromId} from './UtilityHelper';

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
  static onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void;

  static initialize(
    scene: Scene,
    onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void
  ) {
    this.onObjectTransform = onObjectTransform;
    this.isCreatorMode = false;
    this.lastLockedID = '';
    // Gizmo setup
    this.gizmoManager = new GizmoManager(scene);

    // Custom gizmo stuff
    /*const customMesh = MeshBuilder.CreateBox('sphere', undefined, this.gizmoManager.gizmos.rotationGizmo?.gizmoLayer.utilityLayerScene);
    customMesh.scaling = new Vector3(0.01,0.02,0.01);
    this.gizmoManager.gizmos.rotationGizmo?.xGizmo.setCustomMesh(customMesh);*/
  }

  static subscribeForTransformUpdates(objectId: string, node: TransformNode) {
    const updateTransformCallback = () => {
      const myTransfrom: ObjectTransformInterface = {
        position: Vector3.Zero(),
        rotation: Vector3.Zero(),
        scale: Vector3.Zero()
      };

      myTransfrom.position = node.position;
      myTransfrom.rotation = node.rotation;
      myTransfrom.scale = node.scaling;

      // TODO: Check how often data should be sent to onObjectTransform
      this.onObjectTransform(objectId, myTransfrom);
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
      const node = getNodeFromId(objectId);

      if (node) {
        this.gizmoManager.attachToNode(node);
        this.transformSubscription = this.subscribeForTransformUpdates(objectId, node);
      }
    } else {
      this.disableAllGizmos();
      this.transformSubscription?.unsubscribe();
    }
  }

  static tryLockObject(id: string) {
    /*if (this.lastLockedID === id) {
      return;
    }

    if (ObjectHelper.objectsMap.has(id)) {
      //console.log('clicked on an object, trying to lock');

      // TODO: This has to be moved in the setLockedObject function, alongside enabling of gizmo
      console.log('trying to toggle gizmo');
      this.toggleGizmo(id, true);

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
