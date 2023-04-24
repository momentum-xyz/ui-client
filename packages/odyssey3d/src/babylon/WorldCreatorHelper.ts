import {GizmoManager, Scene, TransformNode} from '@babylonjs/core';
import {ObjectTransformInterface} from '@momentum-xyz/core';

import {getNodeFromId} from './UtilityHelper';
import {
  vec3ToPos,
  setNodeTransform,
  TransformTypesEnum,
  vec3Equals
} from './TransformHelper';
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
  static onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void;
  static selectedObject = '';
  static scene: Scene;

  static initialize(
    scene: Scene,
    onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void
  ) {
    this.onObjectTransform = onObjectTransform;
    this.isCreatorMode = false;
    this.lastLockedID = '';
    this.selectedObject = '';
    // Gizmo setup
    this.gizmoManager = new GizmoManager(scene);
    this.scene = scene;

    // Custom gizmo stuff
    /*const customMesh = MeshBuilder.CreateBox('sphere', undefined, this.gizmoManager.gizmos.rotationGizmo?.gizmoLayer.utilityLayerScene);
    customMesh.scaling = new Vector3(0.01,0.02,0.01);
    this.gizmoManager.gizmos.rotationGizmo?.xGizmo.setCustomMesh(customMesh);*/
  }

  static subscribeForTransformUpdates(objectId: string, node: TransformNode) {
    const updateTransformCallback = () => {
      const myTransfrom: ObjectTransformInterface = {
        position: vec3ToPos(node.position),
        rotation: vec3ToPos(node.rotation),
        scale: vec3ToPos(node.scaling)
      };

      // TODO: Check how often data should be sent to onObjectTransform
      console.log('qq: ' + node.rotation.x);
      this.onObjectTransform(objectId, myTransfrom);
    };

    node.onAfterWorldMatrixUpdateObservable.add(updateTransformCallback);

    return {
      unsubscribe: () => {
        node.onAfterWorldMatrixUpdateObservable.removeCallback(updateTransformCallback);
      }
    };
  }

  static setObjectTransform(id: string, transform: ObjectTransformInterface) {
    if (id === this.selectedObject) {
      return;
    }

    const objToMove = ObjectHelper.objectsMap.get(id);
    if (objToMove) {
      const transformNode = objToMove.objectInstance.rootNodes[0];

      if (!vec3Equals(objToMove.objectDefinition.transform.position, transform.position)) {
        console.log(
          'objToMove.objectDefinition.transform.position x: ' +
            objToMove.objectDefinition.transform.position.x
        );
        console.log('transform.position.x: ' + transform.position.x);

        console.log(
          'objToMove.objectDefinition.transform.position y: ' +
            objToMove.objectDefinition.transform.position.y
        );
        console.log('transform.position.y: ' + transform.position.y);

        console.log(
          'objToMove.objectDefinition.transform.position z: ' +
            objToMove.objectDefinition.transform.position.z
        );
        console.log('transform.position.z: ' + transform.position.z);

        console.log('pos changed');
      } else if (!vec3Equals(objToMove.objectDefinition.transform.rotation, transform.rotation)) {
        console.log(
          'objToMove.objectDefinition.transform.rotation x: ' +
            objToMove.objectDefinition.transform.rotation.x
        );
        console.log('transform.rotation.x: ' + transform.rotation.x);

        console.log(
          'objToMove.objectDefinition.transform.rotation y: ' +
            objToMove.objectDefinition.transform.rotation.y
        );
        console.log('transform.rotation.y: ' + transform.rotation.y);

        console.log(
          'objToMove.objectDefinition.transform.rotation z: ' +
            objToMove.objectDefinition.transform.rotation.z
        );
        console.log('transform.rotation.z: ' + transform.rotation.z);

        console.log('rot changed');
      } else if (!vec3Equals(objToMove.objectDefinition.transform.scale, transform.scale)) {
        console.log('scale changed');
      }
      else {
        console.log('nothing changed');
      }

      setNodeTransform(
        transformNode,
        transformNode.position,
        transform.position,
        TransformTypesEnum.Position,
        this.scene
      );
    }
  }

  static toggleCreatorMode() {
    this.isCreatorMode = !this.isCreatorMode;
    this.unlockLastObject();
    this.setGizmoType(GizmoTypesEnum.Position);
  }

  static toggleGizmo(objectId: string, on: boolean) {
    if (on) {
      this.setGizmoType(GizmoTypesEnum.Rotation);
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
