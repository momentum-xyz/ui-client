import {
  AbstractMesh,
  Axis,
  Color3,
  Matrix,
  Mesh,
  Nullable,
  PBRMaterial,
  ParticleSystem,
  Scene,
  SceneLoader,
  Texture,
  TransformNode,
  Vector3
} from '@babylonjs/core';
import {Odyssey3dUserInterface, WorldInfoInterface} from '@momentum-xyz/core';

import hdrTexture from '../static/test.hdr';
import circle from '../static/circle_02.png';
import twirl from '../static/twirl_01.png';

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

export const odysseyParticlesConf = {
  name: 'Odyssey Particle',
  id: 'Odyssey Particle',
  capacity: 5,
  disposeOnStop: false,
  manualEmitCount: -1,
  emitter: [-6, 12, 0],
  particleEmitterType: {
    type: 'PointParticleEmitter',
    direction1: [0, 0, 0],
    direction2: [0, 0, 0]
  },
  texture: {
    tags: null,
    url: circle,
    uOffset: 0,
    vOffset: 0,
    uScale: 1,
    vScale: 1,
    uAng: 0,
    vAng: 0,
    wAng: 0,
    uRotationCenter: 0.5,
    vRotationCenter: 0.5,
    wRotationCenter: 0.5,
    homogeneousRotationInUVTransform: false,
    isBlocking: true,
    name: circle,
    hasAlpha: false,
    getAlphaFromRGB: false,
    level: 1,
    coordinatesIndex: 0,
    optimizeUVAllocation: true,
    coordinatesMode: 0,
    wrapU: 1,
    wrapV: 1,
    wrapR: 1,
    anisotropicFilteringLevel: 4,
    isCube: false,
    is3D: false,
    is2DArray: false,
    gammaSpace: true,
    invertZ: false,
    lodLevelInAlpha: false,
    lodGenerationOffset: 0,
    lodGenerationScale: 0,
    linearSpecularLOD: false,
    isRenderTarget: false,
    animations: [],
    invertY: true,
    samplingMode: 3,
    _useSRGBBuffer: false
  },
  isLocal: false,
  animations: [],
  beginAnimationOnStart: false,
  beginAnimationFrom: 0,
  beginAnimationTo: 60,
  beginAnimationLoop: false,
  startDelay: 0,
  renderingGroupId: 0,
  isBillboardBased: true,
  billboardMode: 7,
  minAngularSpeed: 0,
  maxAngularSpeed: 0,
  minSize: 2,
  maxSize: 2,
  minScaleX: 1,
  maxScaleX: 1,
  minScaleY: 1,
  maxScaleY: 1,
  minEmitPower: 1,
  maxEmitPower: 1,
  minLifeTime: 1,
  maxLifeTime: 2,
  emitRate: 1,
  gravity: [0, 0, 0],
  noiseStrength: [10, 10, 10],
  color1: [0.4117647058823529, 0.596078431372549, 0.6509803921568628, 1],
  color2: [0.21568627450980393, 0.25098039215686274, 0.39215686274509803, 1],
  colorDead: [0, 0, 0, 1],
  updateSpeed: 0.007,
  targetStopDuration: 0,
  blendMode: 0,
  preWarmCycles: 0,
  preWarmStepOffset: 1,
  minInitialRotation: 0,
  maxInitialRotation: 0,
  startSpriteCellID: 0,
  spriteCellLoop: true,
  endSpriteCellID: 0,
  spriteCellChangeSpeed: 1,
  spriteCellWidth: 0,
  spriteCellHeight: 0,
  spriteRandomStartCell: false,
  isAnimationSheetEnabled: false,
  useLogarithmicDepth: false,
  sizeGradients: [
    {gradient: 0, factor1: 1.8, factor2: 1.6},
    {gradient: 1, factor1: 1, factor2: 1}
  ],
  textureMask: [1, 1, 1, 1],
  customShader: null,
  preventAutoStart: false
};

export const sparkParticlesConf = {
  name: 'sparks',
  id: 'sparks',
  capacity: 100,
  disposeOnStop: false,
  manualEmitCount: -1,
  emitter: [-6, 12, 0],
  particleEmitterType: {
    type: 'PointParticleEmitter',
    direction1: [0, 0, 0],
    direction2: [0, 0, 0]
  },
  texture: {
    tags: null,
    url: twirl,
    uOffset: 0,
    vOffset: 0,
    uScale: 1,
    vScale: 1,
    uAng: 0,
    vAng: 0,
    wAng: 0,
    uRotationCenter: 0.5,
    vRotationCenter: 0.5,
    wRotationCenter: 0.5,
    homogeneousRotationInUVTransform: false,
    isBlocking: true,
    name: twirl,
    hasAlpha: false,
    getAlphaFromRGB: false,
    level: 1,
    coordinatesIndex: 0,
    optimizeUVAllocation: true,
    coordinatesMode: 0,
    wrapU: 1,
    wrapV: 1,
    wrapR: 1,
    anisotropicFilteringLevel: 4,
    isCube: false,
    is3D: false,
    is2DArray: false,
    gammaSpace: true,
    invertZ: false,
    lodLevelInAlpha: false,
    lodGenerationOffset: 0,
    lodGenerationScale: 0,
    linearSpecularLOD: false,
    isRenderTarget: false,
    animations: [],
    invertY: true,
    samplingMode: 3,
    _useSRGBBuffer: false
  },
  isLocal: false,
  animations: [],
  beginAnimationOnStart: false,
  beginAnimationFrom: 0,
  beginAnimationTo: 60,
  beginAnimationLoop: false,
  startDelay: 0,
  renderingGroupId: 0,
  isBillboardBased: true,
  billboardMode: 7,
  minAngularSpeed: 1,
  maxAngularSpeed: 3,
  minSize: 1,
  maxSize: 1,
  minScaleX: 1,
  maxScaleX: 1,
  minScaleY: 1,
  maxScaleY: 1,
  minEmitPower: 1,
  maxEmitPower: 1,
  minLifeTime: 2,
  maxLifeTime: 3,
  emitRate: 1.5,
  gravity: [0, 0, 0],
  noiseStrength: [10, 10, 10],
  color1: [0.5176470588235295, 0.3686274509803922, 0.5607843137254902, 1],
  color2: [0.5294117647058824, 0.41568627450980394, 0.41568627450980394, 1],
  colorDead: [0, 0, 0, 1],
  updateSpeed: 0.002,
  targetStopDuration: 0,
  blendMode: 0,
  preWarmCycles: 0,
  preWarmStepOffset: 1,
  minInitialRotation: 0.2,
  maxInitialRotation: 2,
  startSpriteCellID: 0,
  spriteCellLoop: true,
  endSpriteCellID: 0,
  spriteCellChangeSpeed: 1,
  spriteCellWidth: 0,
  spriteCellHeight: 0,
  spriteRandomStartCell: false,
  isAnimationSheetEnabled: false,
  useLogarithmicDepth: false,
  textureMask: [1, 1, 1, 1],
  customShader: null,
  preventAutoStart: false
};

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
        this.generateParticleEffect(rootChildren[1]);

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
    this.rootMesh.setEnabled(false);
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
        this.generateParticleEffect(rootChildren[1]);

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

    customOrbGlassMat.reflectionTexture = new Texture(hdrTexture);
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

  static generateParticleEffect(orbMesh: AbstractMesh) {
    const particleOdyssey = ParticleSystem.Parse(odysseyParticlesConf, this.scene, '');
    particleOdyssey.particleTexture = new Texture(circle);
    particleOdyssey.preWarmCycles = 10;
    particleOdyssey.emitter = orbMesh;
    particleOdyssey.start();

    const sparks = ParticleSystem.Parse(sparkParticlesConf, this.scene, '');
    sparks.emitter = orbMesh;
    sparks.preWarmCycles = 10;
    sparks.particleTexture = new Texture(twirl);
    sparks.start();
  }
}
