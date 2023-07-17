import {
  GPUParticleSystem,
  MeshBuilder,
  ParticleHelper,
  ParticleSystem,
  ParticleSystemSet,
  Scene,
  Texture,
  Vector3
} from '@babylonjs/core';

import merge07 from '../static/Particles/merge07.png';
import dotTexture from '../static/Particles/circle_05.png';
import merge03 from '../static/Particles/light_01.png';
import smoke from '../static/Particles/smoke_07.png';
import collisionJson from '../static/Particles/collisionParticle.json';
import flyingSparksJson from '../static/Particles/FlyingSparks.json';
import collisionCirclejson from '../static/Particles/collisionCircle.json';
import collisionStayOrbJson from '../static/Particles/StayBehindOrb.json';
import collisionSmokeJson from '../static/Particles/collisionSmoke.json';
import wispTrailParticleJson from '../static/Particles/wispTrailParticle.json';
import wispCenterParticleJson from '../static/Particles/wispCenterParticle.json';

import {PlayerHelper} from './PlayerHelper';

const WISP_ANIM_SPEED = 0.001;

export class InteractionEffectHelper {
  static scene: Scene;
  static hi5particlesSet: ParticleSystemSet;

  static initialize(scene: Scene): void {
    this.scene = scene;
  }

  static initializeHi5Particles() {
    // Uses texture: Merge07.png
    const collisionParticle = ParticleSystem.Parse(collisionJson, this.scene, '');
    collisionParticle.particleTexture = new Texture(merge07); // LINK THIS TO Merge07.png

    // Uses texture: Circle_05.png
    const collisionSparkFlying = ParticleSystem.Parse(flyingSparksJson, this.scene, '');
    collisionSparkFlying.particleTexture = new Texture(dotTexture); // LINK THIS TO: circle_05.png

    // Uses texture: light_01.png
    const collisionCircle = ParticleSystem.Parse(collisionCirclejson, this.scene, '');
    collisionCircle.particleTexture = new Texture(merge03); // LINK THIS TO: light_01.png

    // Uses texture: Circle_05.png
    const collisionStayOrb = ParticleSystem.Parse(collisionStayOrbJson, this.scene, '');
    collisionStayOrb.particleTexture = new Texture(dotTexture); // LINK THIS TO: circle_05.png
    collisionStayOrb.startDelay = 1;

    // Uses Texture: smoke_07.png
    const collisionSmoke = ParticleSystem.Parse(collisionSmokeJson, this.scene, '');
    collisionSmoke.particleTexture = new Texture(smoke); // LINK THIS TO: smoke_07.png

    this.hi5particlesSet = ParticleHelper.ExportSet([
      collisionParticle,
      collisionSmoke,
      collisionStayOrb,
      collisionCircle,
      collisionSparkFlying
    ]);
  }

  static startHi5ParticlesForPlayer() {
    const hi5Target = PlayerHelper.camera.getFrontPosition(5);
    this.startHi5ParticlesAtLocation(hi5Target);
  }

  static startHi5ParticlesAtLocation(spawnLocation: Vector3) {
    this.hi5particlesSet.systems.forEach((element) => {
      element.emitter = spawnLocation;
    });

    this.hi5particlesSet.start();
  }

  static setupWispTail() {
    // Create cube as emitter to rotate it later.
    const customEmitter = MeshBuilder.CreateBox(
      'TailEmitter',
      {width: 0.2, height: 0.2, depth: 0.2},
      this.scene
    );
    customEmitter.visibility = 0;
    const particleSet = this.initializeWispIdleParticle();
    particleSet.emitterNode = customEmitter;
    // customEmitter.setParent(PlayerHelper.playerInstance.rootNodes[0]);
    customEmitter.setParent(PlayerHelper.getPlayerNode());
    customEmitter.position = new Vector3(0, 0.2, -0); // Emitter at center of parent.

    this.scene.registerBeforeRender(() => {
      customEmitter.rotation.y = Math.sin(performance.now() * WISP_ANIM_SPEED);
    });
  }

  /**
   * This function creates 4 particle system all using the circle_05.png image.
   * It return a set containing the 4 particle system. Activate it by calling .start(EmitterMesh) on the set.
   * EmitterMesh is an invisible box or sphere placed on the wisp. The partitcles will orginiate on that spot.
   *
   * @returns a particle set.
   */

  static initializeWispIdleParticle() {
    // Create trail particle
    const trailJson = wispTrailParticleJson;
    const trail = ParticleSystem.Parse(trailJson, this.scene, '');
    trail.particleTexture = new Texture(dotTexture);
    trail.direction1 = new Vector3(0, 0.2, 0);
    trail.direction2 = new Vector3(0, 0.2, 0);
    trail.gravity = new Vector3(0, -1, 0);
    trail.preWarmCycles = 100;
    trail.preWarmStepOffset = 20;
    trail.renderingGroupId = 1; // Place particle render after NodeMaterial of the Wisp.

    // Create trail2 particle
    const trail2 = ParticleSystem.Parse(trailJson, this.scene, '');
    trail2.particleTexture = new Texture(dotTexture);
    trail2.direction1 = new Vector3(0.1, 0, 0);
    trail2.direction2 = new Vector3(0.1, 0, 0);
    trail2.gravity = new Vector3(0, -1, 0);
    trail2.preWarmCycles = 100;
    trail2.preWarmStepOffset = 20;
    trail2.renderingGroupId = 1; // Place particle render after NodeMaterial of the Wisp.

    //// Create trail3 particle
    const trail3 = ParticleSystem.Parse(trailJson, this.scene, '');
    trail3.particleTexture = new Texture(dotTexture);
    trail3.direction1 = new Vector3(-0.2, 0, 0);
    trail3.direction2 = new Vector3(-0.2, 0, 0);
    trail3.gravity = new Vector3(0, -1, 0);
    trail3.preWarmCycles = 100;
    trail2.preWarmStepOffset = 20;
    trail3.renderingGroupId = 1; // Place particle render after NodeMaterial of the Wisp.

    // Create tail source
    const CenterJson = wispCenterParticleJson;
    const CenterCircle = GPUParticleSystem.Parse(CenterJson, this.scene, '');
    CenterCircle.particleTexture = new Texture(dotTexture);
    CenterCircle.preWarmCycles = 100;
    CenterCircle.preWarmStepOffset = 20;
    CenterCircle.renderingGroupId = 1;

    return ParticleHelper.ExportSet([trail, trail2, trail3, CenterCircle]);
  }
}
