import {
  AbstractMesh,
  Color3,
  Color4,
  Matrix,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  ParticleSystem,
  Scene,
  SceneLoader,
  Sprite,
  SpriteManager,
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
import rabbit_round from '../static/rabbit_round.png';
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

const THUMB_IMAGE_SIZE = 160;
export const CAMERA_POS_EXPLORER = new Vector3(-1, 15, -37);
export const CAMERA_TARGET_EXPLORER = Vector3.Zero();

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
  static orbMat: PBRMaterial;

  static accountsMap = new Map<string, BabylonAccountInterface>();
  static worldsMap = new Map<string, BabylonWorldInterface>();

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

    // New galaxy
    const sunColor1 = new Color4(1, 1, 1, 1);
    const SunColor2 = new Color4(0.286, 0.635, 0.8671);
    this.buildStar(sunColor1, SunColor2);

    scene.onPointerDown = function castRay() {
      PlayerHelper.camera.lockedTarget = null;
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
    this.odysseyPS.stop();
    this.sparksPS.stop();
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
      result.meshes[1].setEnabled(false);
      this.rootMesh = result.meshes[2];
    });
  }

  static buildNewRingOdysseys(worlds: WorldInfoInterface[]) {
    this.rootMesh.setEnabled(true);
    console.log('buildNewRingOdysseys');
    const rings: TransformNode[] = new Array<TransformNode>();
    let ring = new TransformNode('Odyssey Ring', this.scene);
    rings.push(ring);

    let currentAmount = 15;
    let currentRadius = 7;
    let orbCounter = 0;
    let spaceBetweenOdyssey = 360 / currentAmount;
    let _offset = 0;

    for (let i = 0; i < worlds.length; i++) {
      orbCounter++;
      const radian = _offset * (Math.PI / 180);
      _offset = _offset + spaceBetweenOdyssey;

      const rootClone = this.rootMesh.clone('ring_root' + i, ring) as Mesh;
      if (rootClone) {
        // Set position and Rotation
        rootClone.position.x = Math.cos(radian) * currentRadius;
        rootClone.position.y = 0;
        rootClone.position.z = Math.sin(radian) * currentRadius;
        rootClone.rotation = new Vector3(0, 0, 0);
        this.setOrbPatricles(rootClone);

        // Set avatar image
        if (worlds[i].image !== '') {
          this.GetRoundImageUri(
            this.baseURL + '/texture/s3/' + worlds[i].image,
            THUMB_IMAGE_SIZE,
            (uri) => {
              this.setOrbThumb(uri, rootClone);
            }
          );
        } else {
          this.setOrbThumb(rabbit_round, rootClone, true);
        }

        // Metadata
        rootClone.metadata = worlds[i].id;
        rootClone.material = this.orbMat;

        const babylonWorld = {
          worldDefinition: worlds[i],
          rootClone: rootClone
        };

        this.worldsMap.set(worlds[i].id, babylonWorld);
      }
      if (orbCounter > currentAmount) {
        orbCounter = 0;
        currentAmount += 5;
        currentRadius += 2;
        _offset = 0;
        spaceBetweenOdyssey = 360 / currentAmount;

        ring = new TransformNode('Odyssey Ring', this.scene);
        rings.push(ring);
      }
    }
    const ringRotation = 0.00002;
    for (let i = 0; i < rings.length; i++) {
      this.scene.onBeforeRenderObservable.add(() => {
        rings[i].rotation.y += ringRotation * (i + 1) * this.scene.getEngine().getDeltaTime();
      });
    }
    this.rootMesh.setEnabled(false);
  }

  static buildNewRingAccounts(accounts: Odyssey3dUserInterface[]) {
    this.rootMesh.setEnabled(true);
    const rings: TransformNode[] = new Array<TransformNode>();
    let ring = new TransformNode('Account Ring', this.scene);
    rings.push(ring);

    const amount = 20;
    let currentRadius = 30;
    let orbCounter = 0;
    const spaceBetweenOdyssey = (360 / amount) * 1.5;
    let _offset = 0;

    for (let i = 0; i < accounts.length; i++) {
      orbCounter++;

      const radian = _offset * (Math.PI / 180);
      _offset = _offset + spaceBetweenOdyssey;

      const rootClone = this.rootMesh.clone('ring_root' + i, ring) as Mesh;
      if (rootClone) {
        rootClone.position.x = Math.cos(radian) * currentRadius;
        rootClone.position.y = 0;
        rootClone.position.z = Math.sin(radian) * currentRadius;
        rootClone.position.y = Math.random() * 4;

        rootClone.rotation = new Vector3(0, 0, 0);
        this.setOrbPatricles(rootClone);
        const avatarUrl = accounts[i].avatar ?? '';

        // Set avatar image
        if (avatarUrl !== '') {
          this.GetRoundImageUri(avatarUrl, THUMB_IMAGE_SIZE, (uri) => {
            this.setOrbThumb(uri, rootClone);
          });
        } else {
          this.setOrbThumb(rabbit_round, rootClone, true);
        }
        rootClone.metadata = accounts[i].id;
        rootClone.material = this.orbMat;

        const babylonAccount = {
          accountDefinition: accounts[i],
          rootClone: rootClone
        };

        this.accountsMap.set(accounts[i].id, babylonAccount);
      }

      if (orbCounter > amount) {
        orbCounter = 0;
        currentRadius += 5;

        ring = new TransformNode('Odyssey Ring', this.scene);
        rings.push(ring);
      }
    }

    // Fix for unsafe references
    const ringRotations: {rotationX: number; rotationY: number}[] = [];
    for (let i = 0; i < rings.length; i++) {
      if (i % 3 === 0) {
        ringRotations[i] = {rotationX: 0.00001, rotationY: -0.00001};
      } else if (i % 2 === 0) {
        ringRotations[i] = {rotationX: -0.00001, rotationY: -0.00001};
      } else {
        ringRotations[i] = {rotationX: 0.00001, rotationY: 0.00001};
      }

      this.scene.onBeforeRenderObservable.add(() => {
        rings[i].rotation.x += ringRotations[i].rotationX * this.scene.getEngine().getDeltaTime();
        rings[i].rotation.y += ringRotations[i].rotationY * this.scene.getEngine().getDeltaTime();
      });
    }
    this.rootMesh.setEnabled(false);
  }

  static setOrbThumb(url: string, rootClone: AbstractMesh, placeHolder?: boolean) {
    const size = placeHolder ? 512 : THUMB_IMAGE_SIZE;
    const spriteManager = new SpriteManager(
      'MySpriteManager',
      url,
      1,
      {width: size, height: size},
      this.scene
    );
    const sprite = new Sprite('MySprite', spriteManager);
    sprite.width = 0.7;
    sprite.height = 0.7;
    this.scene.onBeforeRenderObservable.add(() => {
      sprite.position = rootClone.absolutePosition;
    });
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
    customOrbGlassMat.alpha = 0.1;
    customOrbGlassMat.directIntensity = 0.0;
    customOrbGlassMat.environmentIntensity = 0.7;
    customOrbGlassMat.cameraExposure = 0.66;
    customOrbGlassMat.cameraContrast = 1.66;
    customOrbGlassMat.microSurface = 1;
    customOrbGlassMat.reflectivityColor = new Color3(0.2, 0.2, 0.2);
    customOrbGlassMat.albedoColor = new Color3(0.95, 0.95, 0.95);

    this.orbMat = customOrbGlassMat;
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
    particleOdyssey.isLocal = true;
    this.odysseyPS = particleOdyssey;

    const particleSparks = ParticleSystem.Parse(sparksParticle, this.scene, '');
    particleSparks.preWarmCycles = 10;
    particleSparks.particleTexture = new Texture(twirl);
    particleSparks.isLocal = true;
    this.sparksPS = particleSparks;
  }

  static setOrbPatricles(orbMesh: AbstractMesh) {
    const randomNumber = () => {
      const min = 0.1;
      const max = 0.4;
      return Math.random() * (max - min) + min;
    };

    const odysseyPSClone = this.odysseyPS.clone('odysseyPSClone', orbMesh);
    odysseyPSClone.emitRate = randomNumber();
    odysseyPSClone.start();

    const sparksPSClone = this.sparksPS.clone('sparksPSClone', orbMesh);
    sparksPSClone.emitRate = 0.7;
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
        target.rootClone,
        TransformTypesEnum.Rotation,
        1000,
        UniverseBuilderHelper.scene,
        false,
        true
      );

      // Position
      smoothCameraUniverse(
        PlayerHelper.camera.position,
        target.rootClone,
        TransformTypesEnum.Position,
        2000,
        UniverseBuilderHelper.scene,
        true
      );
    }
  }

  static GetRoundImageUri = (url: string, size: number, onDone: (uri: string) => void): void => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, size, size);
        ctx.globalCompositeOperation = 'destination-in';
        // draw our circle mask
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(
          canvas.width / 2, // x
          canvas.height / 2, // y
          canvas.width / 2, // radius
          0, // start angle
          2 * Math.PI // end angle
        );
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        onDone(canvas.toDataURL('png'));
      }
    };

    img.src = url;
  };
}
