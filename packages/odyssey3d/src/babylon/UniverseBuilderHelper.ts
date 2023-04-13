import {
  AbstractMesh,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3
} from '@babylonjs/core';

//import cylinder from '../static/odyssey_base2.glb';
import logo1 from '../static/logo1.png';

import {ObjectHelper} from './ObjectHelper';
import {getAssetFileName} from './UtilityHelper';
import {PlayerHelper} from './PlayerHelper';

// Accounts consts
const ACC_PER_ROW = 20;
const SPACE_BETWEEN_ACC = 10;
const NUMBER_OF_ACC = 500;

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

    await SceneLoader.ImportMeshAsync(
      '',
      ObjectHelper.assetRootUrl,
      assetUrl,
      this.scene,
      (event) => {},
      '.glb'
    ).then((result) => {
      result.meshes[1].rotation = new Vector3(0, 60, 0);
      this.buildAccountLayer(result.meshes[1], result.meshes[2]);
      this.buildRingLayers(result.meshes[1], result.meshes[2]);
    });
  }

  static buildAccountLayer(meshThumb: AbstractMesh, meshOrb: AbstractMesh) {
    let counter = 0;
    let row = 0;
    // Transform node for grouping all account objects.
    const accountLayer = new TransformNode('AccountLayer', this.scene);
    const myTexture = new Texture(logo1);
    const orbMat = new StandardMaterial('orbMat');
    orbMat.alpha = 0.5;
    meshOrb.material = orbMat;

    for (let i = 0; i < NUMBER_OF_ACC; i++) {
      const newInstance1 = meshThumb.clone('acc thumb' + i, accountLayer);
      const newInstance2 = meshOrb.clone('acc orb' + i, accountLayer);
      const newMat = new StandardMaterial('mat' + i);
      newMat.diffuseTexture = myTexture;
      // TODO: Metadata
      //newInstance.rootNodes[0].metadata = { type: "account"}
      if (counter >= ACC_PER_ROW) {
        row++;
        counter = 0;
      }

      if (newInstance1 && newInstance2) {
        // Set the position of the current instance.
        const x = counter * SPACE_BETWEEN_ACC;
        const z = row * SPACE_BETWEEN_ACC;
        newInstance1.position = new Vector3(x, 0, z);
        newInstance2.position = new Vector3(x, 0, z);
        counter++;

        if (i % 2 === 0) {
          newInstance1.material = newMat;
        }
      } else {
        console.log('Something went wrong with loading custom glb for Accounts and Odysseys');
      }
    }

    // Center the accounterLayer in the Universe.
    const offset = (ACC_PER_ROW * SPACE_BETWEEN_ACC) / 2; // Calculate total width. Divide by 2 for mid point.
    accountLayer.position.x = accountLayer.position.x - offset; // Apply the offset to the container.
    accountLayer.position.y = -100;
    accountLayer.position.z = 200;

    PlayerHelper.camera.position = new Vector3(
      accountLayer.position.x,
      accountLayer.position.y,
      accountLayer.position.z
    );
  }

  static buildRingLayers(meshOrb: AbstractMesh, meshThumb: AbstractMesh) {
    // Base variables.
    const AllOdysseyRings = new Array<TransformNode>();
    let totalOdysseys = 500;
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
    meshOrb: AbstractMesh,
    meshThumb: AbstractMesh
  ) {
    const ringLayer = new TransformNode('Ring' + ringNumber, this.scene);
    const spaceBetweenOddyseys = 360 / amount;
    let offset = 0;

    // Create instance and location for every Odyssey. Based on amount given.
    for (let i = 0; i < amount; i++) {
      this.odysseyCounter++;

      const newInstance1 = meshThumb.clone('ring thumb' + this.odysseyCounter, ringLayer);
      const newInstance2 = meshOrb.clone('ring orb' + this.odysseyCounter, ringLayer);
      // Increase OdysseyCounter for naming purposes.
      // TODO: Metadata
      //odysseyNode.name = 'Odyssey' + this.odysseyCounter;
      //odysseyNode.metadata = {type: 'odyssey'};

      // Calculate radian for circle placement.
      // Define how many radian per 1 degree. multiply by current offset (xdegrees)
      const radian = offset * (Math.PI / 180);
      const x = Math.cos(radian) * (Math.random() * ringRadius);
      const y = Math.sin(radian) * ringRadius;
      const z = Math.random() * 2 * ringNumber;

      if (newInstance1 && newInstance2) {
        newInstance1.position = new Vector3(x, y, z);
        newInstance2.position = new Vector3(x, y, z);
        offset = offset + spaceBetweenOddyseys;
      } else {
        console.log('Something went wrong with loading custom glb for Accounts and Odysseys');
      }
    }

    return ringLayer;
  }
}
