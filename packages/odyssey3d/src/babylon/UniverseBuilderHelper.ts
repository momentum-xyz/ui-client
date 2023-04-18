import {
  AbstractMesh,
  Matrix,
  Nullable,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3
} from '@babylonjs/core';
import {Odyssey3dUserInterface, WorldInfoInterface} from '@momentum-xyz/core';

//import cylinder from '../static/odyssey_base2.glb';
//import logo1 from '../static/logo1.png';

import {ObjectHelper} from './ObjectHelper';
import {getAssetFileName} from './UtilityHelper';
import {PlayerHelper} from './PlayerHelper';

// Accounts consts
const ACC_PER_ROW = 20;
const SPACE_BETWEEN_ACC = 10;

interface BabylonAccountInterface {
  accountDefinition: Odyssey3dUserInterface;
  thumbClone: AbstractMesh;
  orbClone: AbstractMesh;
}

interface BabylonWorldInterface {
  worldDefinition: WorldInfoInterface;
  thumbClone: AbstractMesh;
  orbClone: AbstractMesh;
}

export class UniverseBuilderHelper {
  static scene: Scene;
  static odysseyCounter = 0;
  static meshOrb: AbstractMesh;
  static meshThumb: AbstractMesh;
  static accountsMap = new Map<string, BabylonAccountInterface>();
  static worldsMap = new Map<string, BabylonWorldInterface>();

  static async initialize(
    scene: Scene,
    onWorldClick: (objectId: string) => void,
    onUserClick: (userId: string) => void,
    onClickOutside: () => void
  ) {
    this.scene = scene;
    await this.loadModel();

    scene.onPointerDown = function castRay() {
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

          if (UniverseBuilderHelper.accountsMap.has(pickedId)) {
            onUserClick(pickedId);
          } else if (UniverseBuilderHelper.worldsMap.has(pickedId)) {
            onWorldClick(pickedId);
          }
          //console.log('clicked on mesh with name: ' + hit.pickedMesh.name);
          //console.log('clicked on object with id: ' + hit.pickedMesh.metadata);
        } else {
          onClickOutside();
        }
      }
    };
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
      // TODO: Fix rotations
      result.meshes[1].rotation = new Vector3(0, 60, 60);
      this.meshThumb = result.meshes[1];
      this.meshOrb = result.meshes[2];
    });
  }

  static buildAccountLayer(accounts: Odyssey3dUserInterface[]) {
    let counter = 0;
    let row = 0;
    // Transform node for grouping all account objects.
    const accountLayer = new TransformNode('AccountLayer', this.scene);
    const orbMat = new StandardMaterial('orbMat');
    orbMat.alpha = 0.5;
    this.meshOrb.material = orbMat;

    // Spawn
    for (let i = 0; i < accounts.length; i++) {
      const newInstance1 = this.meshThumb.clone('acc_thumb' + i, accountLayer);
      const newInstance2 = this.meshOrb.clone('acc_orb' + i, accountLayer);
      const newMat = new StandardMaterial('acc_mat' + i);

      if (accounts[i].avatar) {
        const downloadedTexture = new Texture(accounts[i].avatar as Nullable<string>);
        newMat.diffuseTexture = downloadedTexture;
      }

      if (counter >= ACC_PER_ROW) {
        row++;
        counter = 0;
      }

      // Assign position and material
      if (newInstance1 && newInstance2) {
        // Set the position of the current instance.
        const x = counter * SPACE_BETWEEN_ACC;
        const z = row * SPACE_BETWEEN_ACC;
        newInstance1.position = new Vector3(x, 0, z);
        newInstance2.position = new Vector3(x, 0, z);
        counter++;

        // TODO: Metadata
        newInstance2.metadata = accounts[i].id;
        newInstance1.material = newMat;

        const babylonAccount = {
          accountDefinition: accounts[i],
          thumbClone: newInstance1,
          orbClone: newInstance2
        };

        this.accountsMap.set(accounts[i].id, babylonAccount);
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

  static buildRingLayers(worlds: WorldInfoInterface[]) {
    // Base variables.
    const AllOdysseyRings = new Array<TransformNode>();
    let totalOdysseys = worlds.length;
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
        worlds
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
    worlds: WorldInfoInterface[]
  ) {
    const ringLayer = new TransformNode('Ring' + ringNumber, this.scene);
    const spaceBetweenOddyseys = 360 / amount;
    let offset = 0;

    // Create instance and location for every Odyssey. Based on amount given.
    for (let i = 0; i < amount; i++) {
      const newInstance1 = this.meshThumb.clone('ring_thumb' + this.odysseyCounter, ringLayer);
      const newInstance2 = this.meshOrb.clone('ring_orb' + this.odysseyCounter, ringLayer);
      const newMat = new StandardMaterial('ring_mat' + this.odysseyCounter);

      if (worlds[this.odysseyCounter].image) {
        const downloadedTexture = new Texture(
          (ObjectHelper.textureRootUrl +
            's3/' +
            worlds[this.odysseyCounter].image) as Nullable<string>
        );
        newMat.diffuseTexture = downloadedTexture;
      }
      //odysseyNode.name = 'Odyssey' + this.odysseyCounter;

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

        newInstance2.metadata = worlds[this.odysseyCounter].id;
        newInstance1.material = newMat;

        const babylonWorld = {
          worldDefinition: worlds[this.odysseyCounter],
          thumbClone: newInstance1,
          orbClone: newInstance2
        };

        this.worldsMap.set(worlds[this.odysseyCounter].id, babylonWorld);
      } else {
        console.log('Something went wrong with loading custom glb for Accounts and Odysseys');
      }
      this.odysseyCounter++;
    }

    return ringLayer;
  }
}
