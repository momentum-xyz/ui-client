import {
  AbstractMesh,
  Color3,
  GizmoManager,
  HighlightLayer,
  Mesh,
  MeshBuilder,
  Scene,
  SceneLoader,
  StandardMaterial,
  TransformNode,
  UtilityLayerRenderer,
  Vector3
} from '@babylonjs/core';
import {ObjectTransformInterface} from '@momentum-xyz/core';

import xPos_blue from '../static/Gizmo/drag_blue_merged.glb';
import yPos_red from '../static/Gizmo/drag_red_merged.glb';
import zPos_green from '../static/Gizmo/drag_green_merged.glb';
import xRot_blue from '../static/Gizmo/rotation_blue_merged.glb';
import yRot_red from '../static/Gizmo/rotation_red_merged.glb';
import zRot_green from '../static/Gizmo/rotation_green_merged.glb';
import xScale_blue from '../static/Gizmo/scale_blue.glb';
import yScale_red from '../static/Gizmo/scale_red.glb';
import zScale_green from '../static/Gizmo/scale_green.glb';
import scale_uniform from '../static/Gizmo/scale_origin.glb';

import {vec3ToPos} from './TransformHelper';
import {ObjectHelper} from './ObjectHelper';

export enum GizmoTypesEnum {
  Position,
  Rotation,
  Scale,
  BoundingBox
}

// const HIGHLIGHT_COLOR = Color3.White();
// const HIGHLIGHT_COLOR = Color3.Purple();
const HIGHLIGHT_COLOR = Color3.Teal();
// const HIGHLIGHT_COLOR = Color3.Green();

export class WorldCreatorHelper {
  static isCreatorMode = false;
  static lastLockedID = '';
  static gizmoManager: GizmoManager;
  static transformSubscription: {unsubscribe: () => void} | undefined;
  static onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void;
  static selectedObjectFromGizmo = '';
  static selectedObjectId = '';
  static scene: Scene;

  static placeholder: AbstractMesh;
  static gizmoPartsMap = new Map<string, AbstractMesh>();

  static highlightLayer: HighlightLayer | undefined;

  static async initialize(
    scene: Scene,
    onObjectTransform: (objectId: string, transform: ObjectTransformInterface) => void
  ) {
    console.log('WorldCreatorHelper initialize');
    this.onObjectTransform = onObjectTransform;
    this.isCreatorMode = false;
    this.lastLockedID = '';
    this.selectedObjectFromGizmo = '';
    this.selectedObjectId = '';
    this.scene = scene;

    // Custom gizmo
    this.gizmoManager = new GizmoManager(scene);
    this.gizmoManager.enableAutoPicking = false;

    this.setGizmoType(GizmoTypesEnum.Position);
    this.setGizmoType(GizmoTypesEnum.Rotation);
    this.setGizmoType(GizmoTypesEnum.Scale);
    await this.setupCustomGizmoParts();
    WorldCreatorHelper.setupCustomGizmo();

    this.highlightLayer = new HighlightLayer('hl1', scene);
  }

  static async setupCustomGizmoParts() {
    this.gizmoPartsMap.set(xPos_blue, this.placeholder);
    this.gizmoPartsMap.set(yPos_red, this.placeholder);
    this.gizmoPartsMap.set(zPos_green, this.placeholder);
    this.gizmoPartsMap.set(xRot_blue, this.placeholder);
    this.gizmoPartsMap.set(yRot_red, this.placeholder);
    this.gizmoPartsMap.set(zRot_green, this.placeholder);
    this.gizmoPartsMap.set(xScale_blue, this.placeholder);
    this.gizmoPartsMap.set(yScale_red, this.placeholder);
    this.gizmoPartsMap.set(zScale_green, this.placeholder);
    this.gizmoPartsMap.set(scale_uniform, this.placeholder);

    for (const gizmoPart of this.gizmoPartsMap) {
      await this.loadCustomGizmoPart(gizmoPart[0]);
    }
  }

  static async loadCustomGizmoPart(url: string) {
    await SceneLoader.LoadAssetContainerAsync(
      url,
      '',
      UtilityLayerRenderer.DefaultUtilityLayer.utilityLayerScene,
      (event) => {},
      '.glb'
    ).then((container) => {
      const instance = container.instantiateModelsToScene();
      const children = instance.rootNodes[0].getChildMeshes();

      this.gizmoPartsMap.set(url, children[0]);
    });
  }

  static setupCustomGizmo() {
    if (
      this.gizmoManager.gizmos.positionGizmo &&
      this.gizmoManager.gizmos.rotationGizmo &&
      this.gizmoManager.gizmos.scaleGizmo
    ) {
      const entries = Array.from(this.gizmoPartsMap.entries());
      if (entries.length !== 10) {
        console.log('Something went wrong with loading gizmo parts');
        return;
      }
      const utilityScene = this.gizmoManager.gizmos.positionGizmo.gizmoLayer.utilityLayerScene;

      // Blue = X, Red = Y, Green = Z
      const redEmissiveMat = new StandardMaterial('', utilityScene);
      redEmissiveMat.emissiveColor = Color3.Red();

      const greenEmissiveMat = new StandardMaterial('', utilityScene);
      greenEmissiveMat.emissiveColor = Color3.Green();

      const blueEmissiveMat = new StandardMaterial('', utilityScene);
      blueEmissiveMat.emissiveColor = Color3.Blue();

      const whiteEmissiveMat = new StandardMaterial('', utilityScene);
      whiteEmissiveMat.emissiveColor = Color3.White();

      // Position meshes
      entries[0][1].material = blueEmissiveMat;
      entries[1][1].material = redEmissiveMat;
      entries[2][1].material = greenEmissiveMat;
      // Rotation meshes
      entries[3][1].material = blueEmissiveMat;
      entries[4][1].material = redEmissiveMat;
      entries[5][1].material = greenEmissiveMat;
      // Scale
      entries[6][1].material = blueEmissiveMat;
      entries[7][1].material = redEmissiveMat;
      entries[8][1].material = greenEmissiveMat;
      entries[9][1].material = whiteEmissiveMat;

      const customMesh = MeshBuilder.CreateBox(
        'box',
        undefined,
        this.gizmoManager.gizmos.positionGizmo.gizmoLayer.utilityLayerScene
      );

      const xPosClone = entries[0][1].clone('xPos', customMesh);
      const yPosClone = entries[1][1].clone('yPos', customMesh);
      const zPosClone = entries[2][1].clone('zPos', customMesh);

      const xRotClone = entries[3][1].clone('xRot', customMesh);
      const yRotClone = entries[4][1].clone('yRot', customMesh);
      const zRotClone = entries[5][1].clone('zRot', customMesh);

      const xScaleClone = entries[6][1].clone('xScale', customMesh);
      const yScaleClone = entries[7][1].clone('yScale', customMesh);
      const zScaleClone = entries[8][1].clone('zScale', customMesh);
      const uniformScaleClone = entries[9][1].clone('uniformScale', customMesh);

      if (
        xPosClone &&
        yPosClone &&
        zPosClone &&
        xRotClone &&
        yRotClone &&
        zRotClone &&
        xScaleClone &&
        yScaleClone &&
        zScaleClone &&
        uniformScaleClone
      ) {
        const posScaling = new Vector3(0.0076, 0.0076, 0.0076);
        const defaultScaling = new Vector3(0.007, 0.007, 0.007);
        const posOffset = 0.099;

        // X POS
        utilityScene.addMesh(xPosClone);
        xPosClone.position = new Vector3(posOffset, 0, 0);
        xPosClone.scaling = posScaling;
        xPosClone.setParent(null);

        // Y POS
        utilityScene.addMesh(yPosClone);
        yPosClone.position = new Vector3(0, posOffset, 0);
        yPosClone.scaling = posScaling;
        yPosClone.setParent(null);

        // Z POS
        utilityScene.addMesh(zPosClone);
        zPosClone.position = new Vector3(0, 0, posOffset);
        zPosClone.scaling = posScaling;
        zPosClone.setParent(null);

        // X ROT
        utilityScene.addMesh(xRotClone);
        xRotClone.position = new Vector3(0, 0.05, 0.05);
        xRotClone.scaling = defaultScaling;
        xRotClone.setParent(null);

        // Y ROT
        utilityScene.addMesh(yRotClone);
        yRotClone.position = new Vector3(0.05, 0, 0.05);
        yRotClone.scaling = new Vector3(0.0018, 0.054, 0.0018);
        yRotClone.setParent(null);

        // Z ROT
        utilityScene.addMesh(zRotClone);
        zRotClone.position = new Vector3(0.05, 0.05, 0);
        zRotClone.scaling = new Vector3(0.0018, 0.054, 0.0018);
        zRotClone.setParent(null);

        // X SCALE
        utilityScene.addMesh(xScaleClone);
        xScaleClone.position = new Vector3(0.07, 0, 0);
        xScaleClone.scaling = defaultScaling;
        xScaleClone.setParent(null);

        // Y SCALE
        utilityScene.addMesh(yScaleClone);
        yScaleClone.position = new Vector3(0, 0.07, 0);
        yScaleClone.scaling = defaultScaling;
        yScaleClone.setParent(null);

        // Z SCALE
        utilityScene.addMesh(zScaleClone);
        zScaleClone.position = new Vector3(0, 0, 0.07);
        zScaleClone.scaling = defaultScaling;
        zScaleClone.setParent(null);

        // UNIFORM SCALE
        utilityScene.addMesh(uniformScaleClone);
        uniformScaleClone.position = new Vector3(0, 0, 0);
        uniformScaleClone.scaling = defaultScaling;
        uniformScaleClone.setParent(null);

        // Disable original meshes
        entries.forEach((element) => {
          element[1].setEnabled(false);
        });
        customMesh.setEnabled(false);
      } else {
        console.log('Unable to clone some of the gizmo parts.');
      }

      this.gizmoManager.gizmos.positionGizmo.xGizmo.setCustomMesh(xPosClone as Mesh);
      this.gizmoManager.gizmos.positionGizmo.yGizmo.setCustomMesh(yPosClone as Mesh);
      this.gizmoManager.gizmos.positionGizmo.zGizmo.setCustomMesh(zPosClone as Mesh);

      this.gizmoManager.gizmos.rotationGizmo.xGizmo.setCustomMesh(xRotClone as Mesh);
      this.gizmoManager.gizmos.rotationGizmo.yGizmo.setCustomMesh(yRotClone as Mesh);
      this.gizmoManager.gizmos.rotationGizmo.zGizmo.setCustomMesh(zRotClone as Mesh);

      this.gizmoManager.gizmos.scaleGizmo.xGizmo.setCustomMesh(xScaleClone as Mesh);
      this.gizmoManager.gizmos.scaleGizmo.yGizmo.setCustomMesh(yScaleClone as Mesh);
      this.gizmoManager.gizmos.scaleGizmo.zGizmo.setCustomMesh(zScaleClone as Mesh);
      this.gizmoManager.gizmos.scaleGizmo.uniformScaleGizmo.setCustomMesh(
        uniformScaleClone as Mesh
      );

      this.disableAllGizmos();
    } else {
      console.log('Position, rotation or scale gizmo doesnt exist');
    }
  }

  static subscribeForTransformUpdates(objectId: string, node: TransformNode, spawn = false) {
    const updateTransformCallback = () => {
      let posToSend: Vector3;
      let rotToSend: Vector3;
      let scaleToSend: Vector3;

      if (spawn) {
        posToSend = node.absolutePosition;
        rotToSend = node.absoluteRotationQuaternion.toEulerAngles();
        scaleToSend = new Vector3(1, 1, 1);
      } else {
        posToSend = node.position;
        rotToSend = node.rotation;
        scaleToSend = node.scaling;
      }
      const myTransfrom: ObjectTransformInterface = {
        position: vec3ToPos(posToSend),
        rotation: vec3ToPos(rotToSend),
        scale: vec3ToPos(scaleToSend)
      };
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
    if (id === this.selectedObjectFromGizmo || id === ObjectHelper.selectedObjectFromSpawn) {
      return;
    }

    ObjectHelper.objectsMap.get(id)?.setTransform(transform);
  }

  static toggleCreatorMode() {
    /*this.isCreatorMode = !this.isCreatorMode;
    this.unlockLastObject();
    this.setGizmoType(GizmoTypesEnum.Position);
    this.setGizmoType(GizmoTypesEnum.Rotation);
    this.setGizmoType(GizmoTypesEnum.Scale);*/
  }

  static toggleGizmo(objectId: string, on: boolean) {
    console.log('toggleGizmo', objectId, on);
    if (on) {
      this.selectedObjectFromGizmo = objectId;

      this.setGizmoType(GizmoTypesEnum.Position);
      this.setGizmoType(GizmoTypesEnum.Rotation);
      this.setGizmoType(GizmoTypesEnum.Scale);

      const node = ObjectHelper.objectsMap.get(objectId)?.getNode();

      if (node) {
        this.gizmoManager.attachToNode(node);
        this.transformSubscription = this.subscribeForTransformUpdates(objectId, node);
      }
    } else {
      this.disableAllGizmos();
      this.transformSubscription?.unsubscribe();
      this.selectedObjectFromGizmo = '';
    }
  }

  static toggleHightlightObject(objectId: string, on: boolean) {
    if (this.selectedObjectId === objectId) {
      return;
    }

    const id = on ? objectId : this.selectedObjectId;
    this.selectedObjectId = id;

    const node = ObjectHelper.objectsMap.get(id)?.getNode();
    console.log('toggleHightlightObject', {objectId, on, node});

    const meshes = node?.getChildMeshes();
    if (on) {
      if (meshes && node) {
        // deselect previously selected ones
        this.highlightLayer?.removeAllMeshes();

        for (const mesh of meshes || []) {
          try {
            if (mesh instanceof Mesh) {
              this.highlightLayer?.addMesh(mesh, HIGHLIGHT_COLOR);
            }
          } catch (e) {
            console.log('Add mesh to highlight layer error: ', e);
          }
        }
      }
    } else {
      this.highlightLayer?.removeAllMeshes();
    }

    this.selectedObjectId = on ? objectId : '';
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
