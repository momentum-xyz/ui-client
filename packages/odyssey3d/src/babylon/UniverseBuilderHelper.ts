import {
  AbstractMesh,
  Axis,
  Color3,
  Matrix,
  Mesh,
  Nullable,
  PBRMaterial,
  Scene,
  SceneLoader,
  Texture,
  TransformNode,
  Vector3
} from '@babylonjs/core';
import {Odyssey3dUserInterface, WorldInfoInterface} from '@momentum-xyz/core';

//import hdrTexture from '../static/test.hdr';

import {ObjectHelper} from './ObjectHelper';
import {getAssetFileName} from './UtilityHelper';
import {PlayerHelper} from './PlayerHelper';

// Accounts consts
const ACC_PER_ROW = 20;
const SPACE_BETWEEN_ACC = 10;

interface BabylonAccountInterface {
  accountDefinition: Odyssey3dUserInterface;
  rootClone: AbstractMesh;
}

interface BabylonWorldInterface {
  worldDefinition: WorldInfoInterface;
  rootClone: AbstractMesh;
}

export class UniverseBuilderHelper {
  static scene: Scene;
  static odysseyCounter = 0;

  static rootMesh: AbstractMesh;
  static thumbMat: PBRMaterial;
  static orbMat: PBRMaterial;

  static accountsMap = new Map<string, BabylonAccountInterface>();
  static worldsMap = new Map<string, BabylonWorldInterface>();
  static totalAmount = 0;

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

          // Currently worldIds === userIds, so every click on mesh will be userClick.
          if (UniverseBuilderHelper.accountsMap.has(pickedId)) {
            onUserClick(pickedId);
            console.log('user');
          } else if (UniverseBuilderHelper.worldsMap.has(pickedId)) {
            onWorldClick(pickedId);
            console.log('world');
          }
        } else {
          onClickOutside();
        }
      }
    };
  }

  static async loadModel() {
    // custom odyssey glb
    const assetUrl = getAssetFileName('2dc7df8e-a34a-829c-e3ca-b73bfe99faf0');
    await SceneLoader.ImportMeshAsync(
      '',
      ObjectHelper.assetRootUrl,
      assetUrl,
      this.scene,
      (event) => {},
      '.glb'
    ).then((result) => {
      this.defineCustomMaterial();
      this.rootMesh = result.meshes[0];
      this.thumbMat = result.meshes[1].material as PBRMaterial;
    });
  }

  static buildAccountLayer(accounts: Odyssey3dUserInterface[]) {
    let counter = 0;
    let row = 0;
    // Transform node for grouping all account objects.
    const accountLayer = new TransformNode('AccountLayer', this.scene);

    // Spawn
    for (let i = 0; i < accounts.length; i++) {
      const rootClone = this.rootMesh.clone('acc_root' + i, accountLayer) as Mesh;
      const rootChildren = rootClone.getChildMeshes();

      if (counter >= ACC_PER_ROW) {
        row++;
        counter = 0;
      }

      // Assign position and material
      if (rootClone && rootChildren.length > 1) {
        // Set the position of the current instance.
        const x = counter * SPACE_BETWEEN_ACC;
        const z = row * SPACE_BETWEEN_ACC;
        rootClone.position = new Vector3(x, 0, z);
        rootClone.rotation = new Vector3(0, 0, 0);
        counter++;

        // Metadata
        rootChildren[1].metadata = accounts[i].id;
        rootChildren[1].material = this.orbMat;

        if (accounts[i].avatar !== '') {
          this.setOrbRotation(rootClone, rootChildren[0]);

          const downloadedTexture = new Texture(accounts[i].avatar as Nullable<string>);
          const thumbMatClone = this.thumbMat.clone('thumbMatCloneAcc' + i);
          thumbMatClone.albedoTexture = downloadedTexture;
          rootChildren[0].material = thumbMatClone;
        }

        rootClone.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const babylonAccount = {
          accountDefinition: accounts[i],
          rootClone: rootClone
        };

        this.accountsMap.set(accounts[i].id, babylonAccount);
      } else {
        console.log('Something went wrong with loading custom glb for Accounts and Odysseys');
      }
    }

    // Center the accounterLayer in the Universe.
    const offset = (ACC_PER_ROW * SPACE_BETWEEN_ACC) / 2; // Calculate total width. Divide by 2 for mid point.
    accountLayer.position.x = accountLayer.position.x - offset; // Apply the offset to the container.
    accountLayer.position.y = -10;
    accountLayer.position.z = 200;

    PlayerHelper.camera.setTarget(accountLayer.position);
  }

  static buildRingLayers(worlds: WorldInfoInterface[]) {
    this.odysseyCounter = 0;
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
      const rootClone = this.rootMesh.clone('ring_root' + i, ringLayer) as Mesh;
      const rootChildren = rootClone.getChildMeshes();

      // Calculate radian for circle placement.
      // Define how many radian per 1 degree. multiply by current offset (xdegrees)
      const radian = offset * (Math.PI / 180);
      const x = Math.cos(radian) * (Math.random() * ringRadius);
      const y = Math.sin(radian) * ringRadius;
      const z = Math.random() * 2 * ringNumber;

      if (rootClone) {
        rootClone.position = new Vector3(x, y, z);
        rootClone.rotation = new Vector3(0, 0, 0);
        offset = offset + spaceBetweenOddyseys;

        // Metadata
        rootChildren[1].metadata = worlds[i].id;
        rootChildren[1].material = this.orbMat;

        if (worlds[this.odysseyCounter].image !== '') {
          this.setOrbRotation(rootClone, rootChildren[0]);

          const downloadedTexture = new Texture(
            (ObjectHelper.textureRootUrl +
              's3/' +
              worlds[this.odysseyCounter].image) as Nullable<string>
          );
          const thumbMatClone = this.thumbMat.clone('thumbMatCloneWorld' + i);
          thumbMatClone.albedoTexture = downloadedTexture;
          rootChildren[0].material = thumbMatClone;
        }
        rootClone.billboardMode = Mesh.BILLBOARDMODE_ALL;

        const babylonWorld = {
          worldDefinition: worlds[this.odysseyCounter],
          rootClone: rootClone
        };

        this.worldsMap.set(worlds[this.odysseyCounter].id, babylonWorld);
      } else {
        console.log('Something went wrong with loading custom glb for Accounts and Odysseys');
      }

      this.odysseyCounter++;
    }

    return ringLayer;
  }

  static defineCustomMaterial() {
    // TODO: Check with Frank how is this supposed to look
    const customOrbGlassMat = new PBRMaterial('orbGlass', this.scene);

    //customOrbGlassMat.reflectionTexture = new Texture(hdrTexture);
    customOrbGlassMat.indexOfRefraction = 0.52;
    customOrbGlassMat.alpha = 0.5;
    customOrbGlassMat.directIntensity = 0.0;
    customOrbGlassMat.environmentIntensity = 0.7;
    customOrbGlassMat.cameraExposure = 0.66;
    customOrbGlassMat.cameraContrast = 1.66;
    customOrbGlassMat.microSurface = 1;
    customOrbGlassMat.reflectivityColor = new Color3(0.2, 0.2, 0.2);
    customOrbGlassMat.albedoColor = new Color3(0.95, 0.95, 0.95);

    this.orbMat = customOrbGlassMat;
  }

  static setOrbRotation(root: AbstractMesh, thumb: AbstractMesh) {
    // Override babylon's conversion of left-right hand
    root.scaling = new Vector3(1, 1, 1);
    const alphaRot = -0.25 * 2 * Math.PI;
    root.rotate(Axis.X, alphaRot);
    thumb.rotation = new Vector3(0, 0, 0);
    const betaRot = 0.05 * 2 * Math.PI;
    thumb.rotate(Axis.Y, betaRot);
  }
}
