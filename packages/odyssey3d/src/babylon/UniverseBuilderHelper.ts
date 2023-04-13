import {AssetContainer, Mesh, PBRMaterial, Scene, SceneLoader, Texture, TransformNode, Vector3} from '@babylonjs/core';

//import cylinder from '../static/odyssey_base2.glb';
import someTexture from '../static/logo1.png'

import {ObjectHelper} from './ObjectHelper';
import {getAssetFileName} from './UtilityHelper';
import { PlayerHelper } from './PlayerHelper';

// Accounts consts
const ACC_PER_ROW = 20;
const SPACE_BETWEEN_ACC = 10;
const NUMBER_OF_ACC = 1000;

export class UniverseBuilderHelper {
  static scene: Scene;
  static odysseyCounter = 0;

  static initialize(scene: Scene): void {
    this.scene = scene;
  }

  static async buildEntireUniverse() {
    await this.loadModel();
  }

  static async loadModel() {
    // custom odyssey glb
    const assetUrl = getAssetFileName('d94ec058-c048-b4f6-e5fc-e154a7ef99c0');

    await SceneLoader.LoadAssetContainerAsync(
      ObjectHelper.assetRootUrl,
      assetUrl,
      this.scene,
      (event) => {},
      '.glb'
    ).then((container) => {
      const instance = container.instantiateModelsToScene();
      const odysseyMeshes = instance.rootNodes[0].getChildMeshes();

      odysseyMeshes[0].setParent(null);
      odysseyMeshes[0].isVisible = false;

      odysseyMeshes[1].setParent(null);
      odysseyMeshes[1].isVisible = false;

      /*const meshThumb = odysseyMeshes[0] as Mesh;
      const meshOrb = odysseyMeshes[1] as Mesh;*/

      this.buildAccountLayer(container/*meshOrb, meshThumb*/);
      //this.buildRingLayers(meshOrb, meshThumb);
    });
  }

  static buildAccountLayer(myContainer: AssetContainer) {
    let counter = 0;
    let row = 0;
    // Transform node for grouping all account objects.
    const accountLayer = new TransformNode('AccountLayer', this.scene);

    for (let index = 0; index < NUMBER_OF_ACC; index++) {
      const newInstance1 = myContainer.instantiateModelsToScene(undefined,true);

      // TODO: Metadata
      //newInstance.rootNodes[0].metadata = { type: "account"}
      // Adapt numbers based on current instance.
      if (counter >= ACC_PER_ROW) {
        row++;
        counter = 0;
      }

      // Set the position of the current instance.
      const x = counter * SPACE_BETWEEN_ACC;
      const z = row * SPACE_BETWEEN_ACC;
      newInstance1.rootNodes[0].position = new Vector3(x, 0, z);
      counter++;

      // Set the parent of the current instance to the transform node. ( account layer)
      const meshes = newInstance1.rootNodes[0].getChildMeshes();

      if (index === 1) {
        const myMat = meshes[0].material as PBRMaterial;
        const myTexture = new Texture(someTexture);
        myMat.albedoTexture = myTexture;
      }

      meshes.forEach(mesh => {
        mesh.setParent(accountLayer);
      });

      // small optimization at the cost of scene organization
      newInstance1.rootNodes[0].dispose();
    }

    // Center the accounterLayer in the Universe.
    const offset = (ACC_PER_ROW * SPACE_BETWEEN_ACC) / 2; // Calculate total width. Divide by 2 for mid point.
    accountLayer.position.x = accountLayer.position.x - offset; // Apply the offset to the container.
    accountLayer.position.y = -100;
    accountLayer.position.z = 200;

    PlayerHelper.camera.position = new Vector3(accountLayer.position.x, accountLayer.position.y, accountLayer.position.z);
  }

  static buildRingLayers(meshOrb: Mesh, meshThumb: Mesh) {
    // Base variables.
    const AllOdysseyRings = new Array<TransformNode>();
    let totalOdysseys = 2000;
    const halfAmountOfOdysseys = totalOdysseys / 2;

    // Calculate amount of Odyssey is next ring.
    let odysseysInThisRing = 12;
    let ringRadius = 25;
    let zValueRing = 10;

    // Start building rings.
    while (totalOdysseys >= 1) {
      if (odysseysInThisRing <= 0) {
        return;
      }
      totalOdysseys = totalOdysseys - odysseysInThisRing;

      // Build the ring.
      const newRing: TransformNode = this.buildRing(
        odysseysInThisRing,
        ringRadius,
        AllOdysseyRings.length,
        meshOrb,
        meshThumb
      );

      // Set newRing depth
      newRing.position.z = zValueRing;
      AllOdysseyRings.push(newRing);
      zValueRing = zValueRing * 1.2;

      if (totalOdysseys >= halfAmountOfOdysseys) {
        // prepare amount for the next ring.
        odysseysInThisRing = Math.floor(odysseysInThisRing * 1.2);

        // Preparing ring radius
        ringRadius = ringRadius * 1.1;
      } else {
        ringRadius = ringRadius * 0.9;
      }

      if (totalOdysseys <= 0) {
        totalOdysseys = 0;
      }

      if (odysseysInThisRing > totalOdysseys) {
        odysseysInThisRing = totalOdysseys;
      }
    }

    // Create one transform for all Rings.
    const allRingsTransformNode = new TransformNode('GlobalUniverseTransform', this.scene);
    AllOdysseyRings.forEach((ring) => (ring.parent = allRingsTransformNode));
    allRingsTransformNode.position.z = 200;
    allRingsTransformNode.position.y = 50;
  }

  static buildRing(
    amount: number,
    ringRadius: number,
    ringNumber: number,
    meshOrb: Mesh,
    meshThumb: Mesh
  ) {
    const ring = new TransformNode('Ring' + ringNumber, this.scene);
    const spaceBetweenOddyseys = 360 / amount;
    let offset = 0;

    // Create instance and location for every Odyssey. Based on amount given.
    for (let i = 0; i < amount; i++) {
      const newInstance1 = meshOrb.createInstance('orb' + i);
      const newInstance2 = meshThumb.createInstance('thumb' + i);

      // Increase OdysseyCounter for naming purposes.
      this.odysseyCounter++;
      // TODO: Metadata
      //odysseyNode.name = 'Odyssey' + this.odysseyCounter;
      //odysseyNode.metadata = {type: 'odyssey'};

      // Calculate radian for circle placement.
      // Define how many radian per 1 degree. multiply by current offset (xdegrees)
      const radian = offset * (Math.PI / 180);
      const x = Math.cos(radian) * (Math.random() * ringRadius);
      const y = Math.sin(radian) * ringRadius;
      const z = Math.random() * 2 * ringNumber;

      newInstance1.position = new Vector3(x, y, z);
      newInstance2.position = new Vector3(x, y, z);
      offset = offset + spaceBetweenOddyseys;

      newInstance1.setParent(ring);
      newInstance2.setParent(ring);
    }

    return ring;
  }
}
