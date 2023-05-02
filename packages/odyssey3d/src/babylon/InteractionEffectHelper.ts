import {
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

import {PlayerHelper} from './PlayerHelper';

export class InteractionEffectHelper {
  static scene: Scene;
  static particlesSet: ParticleSystemSet;

  static initialize(scene: Scene): void {
    this.scene = scene;
    this.initializeParticles();
  }

  static startParticlesForPlayer() {
    const hi5Target = PlayerHelper.camera.getFrontPosition(5);
    this.startParticlesAtLocation(hi5Target);
  }

  static startParticlesAtLocation(location: Vector3) {
    this.startParticlesAt(location);
  }

  static initializeParticles() {
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

    this.particlesSet = ParticleHelper.ExportSet([
      collisionParticle,
      collisionSmoke,
      collisionStayOrb,
      collisionCircle,
      collisionSparkFlying
    ]);
  }

  static startParticlesAt(spawnLocation: Vector3) {
    this.particlesSet.systems.forEach((element) => {
      element.emitter = spawnLocation;
    });

    this.particlesSet.start();
  }
}
