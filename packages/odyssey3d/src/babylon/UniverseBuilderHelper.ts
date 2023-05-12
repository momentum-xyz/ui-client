import {
  AbstractMesh,
  Axis,
  Color3,
  Color4,
  Matrix,
  Mesh,
  MeshBuilder,
  Nullable,
  PBRMaterial,
  ParticleSystem,
  Scene,
  SceneLoader,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3
} from '@babylonjs/core';
import {Odyssey3dUserInterface, WorldInfoInterface} from '@momentum-xyz/core';

import hdrTexture from '../static/test.hdr';
import circle from '../static/Particles/circle_02.png';
import twirl from '../static/Particles/twirl_01.png';
import odysseyParticle from '../static/Particles/odysseyParticle.json';
import sparksParticle from '../static/Particles/sparksParticle.json';
// Star
import surface from '../static/Particles/surface.png';
import starlight from '../static/Particles/dot.png';
import starSparksTexture from '../static/Particles/spark_03.png';
import starCenterParticle from '../static/Particles/starCenterParticle.json';
import starGlowParticle from '../static/Particles/starGlowParticle.json';
import starSparksParticle from '../static/Particles/starSparksParticle.json';

import {getAssetFileName} from './UtilityHelper';
import {PlayerHelper} from './PlayerHelper';
import {TransformTypesEnum, smoothCameraUniverse} from './TransformHelper';

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
  static baseURL = '';

  static rootMesh: AbstractMesh;
  static thumbMat: PBRMaterial;
  static orbMat: PBRMaterial;

  static accountsMap = new Map<string, BabylonAccountInterface>();
  static worldsMap = new Map<string, BabylonWorldInterface>();
  static totalAmount = 0;
  static odysseyCounter = 0;

  static odysseyPS: ParticleSystem;
  static sparksPS: ParticleSystem;

  // Star
  static starSphere: AbstractMesh;
  static starMaterial: StandardMaterial;

  static async initialize(
    scene: Scene,
    assetBaseURL: string,
    onWorldClick: (objectId: string) => void,
    onUserClick: (userId: string) => void,
    onClickOutside: () => void
  ) {
    this.scene = scene;
    this.baseURL = assetBaseURL;
    this.initializeOrbParticles();
    await this.loadModel();

    const sunColor1 = new Color4(1, 1, 1, 1);
    const SunColor2 = new Color4(0.286, 0.635, 0.8671);
    this.buildStar(sunColor1, SunColor2);
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
            UniverseBuilderHelper.goToOrb(pickedId, true);
            onUserClick(pickedId);
            console.log('user');
          } else if (UniverseBuilderHelper.worldsMap.has(pickedId)) {
            UniverseBuilderHelper.goToOrb(pickedId, false);
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
      `${this.baseURL}/asset/`,
      assetUrl,
      this.scene,
      (event) => {},
      '.glb'
    ).then((result) => {
      this.defineOrbMaterial();
      this.rootMesh = result.meshes[0];
      this.thumbMat = result.meshes[1].material as PBRMaterial;
    });
  }

  static buildAccountLayer(accounts: Odyssey3dUserInterface[]) {
    this.rootMesh.setEnabled(true);

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
        this.setOrbPatricles(rootChildren[1]);

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

    // After all of the orbs are done cloning, disable the initial one
    PlayerHelper.camera.setTarget(accountLayer.position);
    this.rootMesh.setEnabled(false);
  }

  static buildOdysseyLayers(worlds: WorldInfoInterface[]) {
    this.rootMesh.setEnabled(true);

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
      odysseysInThisRing = Math.min(totalOdysseys, odysseysInThisRing);

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

      totalOdysseys = totalOdysseys - odysseysInThisRing;
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
    allRingsTransformNode.position.z = 200;
    allRingsTransformNode.position.y = 50;
    AllOdysseyRings.forEach((ring) => (ring.parent = allRingsTransformNode));

    this.rootMesh.setEnabled(false);
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
        rootChildren[1].metadata = worlds[this.odysseyCounter].id;
        rootChildren[1].material = this.orbMat;

        if (worlds[this.odysseyCounter].image !== '') {
          this.setOrbRotation(rootClone, rootChildren[0]);

          const downloadedTexture = new Texture(
            (this.baseURL + '/texture/s3/' + worlds[this.odysseyCounter].image) as Nullable<string>
          );
          const thumbMatClone = this.thumbMat.clone('thumbMatCloneWorld' + i);
          thumbMatClone.albedoTexture = downloadedTexture;
          rootChildren[0].material = thumbMatClone;
        }
        rootClone.billboardMode = Mesh.BILLBOARDMODE_ALL;
        this.setOrbPatricles(rootChildren[1]);

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

  static buildStar(color1: Color4, color2: Color4) {
    this.starSphere = MeshBuilder.CreateSphere('centerStar', {diameter: 6}, this.scene);
    this.starSphere.visibility = 1;
    this.defineStarMaterial();
    this.initializeStarParticles(color1, color2);
  }

  static defineStarMaterial() {
    const starMat = new StandardMaterial('StarMaterial', this.scene);
    starMat.diffuseColor = new Color3(0, 0, 0);
    starMat.emissiveColor = new Color3(0.3773, 0.093, 0.0266);
    this.starMaterial = starMat;
    this.starSphere.material = starMat;
  }

  static defineOrbMaterial() {
    const customOrbGlassMat = new PBRMaterial('orbGlass', this.scene);

    customOrbGlassMat.reflectionTexture = new Texture(hdrTexture);
    customOrbGlassMat.indexOfRefraction = 0.52;
    customOrbGlassMat.alpha = 0.2;
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

  static initializeStarParticles(color1: Color4, color2: Color4) {
    // Create the surface
    const centerStarSurface = ParticleSystem.Parse(starCenterParticle, this.scene, '');
    centerStarSurface.particleTexture = new Texture(surface);
    centerStarSurface.emitter = this.starSphere;
    centerStarSurface.preWarmCycles = 100;
    centerStarSurface.preWarmStepOffset = 20;
    centerStarSurface.renderingGroupId = 1;

    //Apply colors from constructor:
    centerStarSurface.color1 = color1;
    centerStarSurface.color2 = color2;
    centerStarSurface.start();

    // Create the glow
    const starGlow = ParticleSystem.Parse(starGlowParticle, this.scene, '');
    starGlow.particleTexture = new Texture(starlight);
    starGlow.emitter = this.starSphere;
    starGlow.preWarmCycles = 100;
    starGlow.preWarmStepOffset = 20;
    starGlow.color1 = color1;
    starGlow.color2 = color2;
    starGlow.start();

    // Sparks
    const starSparks = ParticleSystem.Parse(starSparksParticle, this.scene, '');
    starSparks.particleTexture = new Texture(starSparksTexture);
    starSparks.emitter = this.starSphere;
    starSparks.preWarmCycles = 100;
    starSparks.preWarmStepOffset = 20;
    starSparks.start();
  }

  static initializeOrbParticles() {
    const particleOdyssey = ParticleSystem.Parse(odysseyParticle, this.scene, '');
    particleOdyssey.preWarmCycles = 10;
    particleOdyssey.particleTexture = new Texture(circle);
    this.odysseyPS = particleOdyssey;

    const particleSparks = ParticleSystem.Parse(sparksParticle, this.scene, '');
    particleSparks.preWarmCycles = 10;
    particleSparks.particleTexture = new Texture(twirl);
    this.sparksPS = particleSparks;
  }

  static setOrbPatricles(orbMesh: AbstractMesh) {
    const delay = Math.floor(Math.random() * 3000);
    this.odysseyPS.startDelay = delay;

    const odysseyPSClone = this.odysseyPS.clone('odysseyPSClone', orbMesh);
    odysseyPSClone.start(delay);

    const sparksPSClone = this.sparksPS.clone('sparksPSClone', orbMesh);
    sparksPSClone.startDelay = delay;
    sparksPSClone.start();
  }

  static goToOrb(id: string, isAccount = true) {
    let target = undefined;

    if (isAccount) {
      target = UniverseBuilderHelper.accountsMap.get(id);
    } else {
      target = UniverseBuilderHelper.worldsMap.get(id);
    }

    if (target) {
      // Rotation
      smoothCameraUniverse(
        PlayerHelper.camera.target,
        target.rootClone.absolutePosition,
        TransformTypesEnum.Rotation,
        1000,
        UniverseBuilderHelper.scene,
        false
      );

      // Position
      smoothCameraUniverse(
        PlayerHelper.camera.position,
        target.rootClone.absolutePosition,
        TransformTypesEnum.Position,
        2000,
        UniverseBuilderHelper.scene,
        true
      );
    }
  }
}
