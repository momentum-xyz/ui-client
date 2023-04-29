import {ParticleHelper, ParticleSystem, Scene, Texture, Vector3} from '@babylonjs/core';

import merge07 from '../static/Particles/merge07.png';
import dotTexture from '../static/Particles/circle_05.png';
import merge03 from '../static/Particles/light_01.png';
import smoke from '../static/Particles/smoke_07.png';
import collisionJson from '../static/Particles/collisionParticle.json';
import flyingSparksJson from '../static/Particles/FlyingSparks.json';
import collisionCirclejson from '../static/Particles/collisionCircle.json';
import collisionStayOrbJson from '../static/Particles/StayBehindOrb.json';
import collisionSmokeJson from '../static/Particles/collisionSmoke.json';

export class InteractionEffectHelper {
  static scene: Scene;

  static initialize(scene: Scene): void {
    this.scene = scene;
  }

  static startParticles(location: Vector3) {
    const particleSystem = this.hi5Particles(location);
    particleSystem.start();
  }

  static hi5Particles(spawnLocation: Vector3) {
    // Uses texture: Merge07.png
    const collisionParticle = ParticleSystem.Parse(collisionJson, this.scene, '');
    collisionParticle.particleTexture = new Texture(merge07); // LINK THIS TO Merge07.png
    collisionParticle.emitter = spawnLocation;

    // Uses texture: Circle_05.png
    const collisionSparkFlying = ParticleSystem.Parse(flyingSparksJson, this.scene, '');
    collisionSparkFlying.particleTexture = new Texture(dotTexture); // LINK THIS TO: circle_05.png
    collisionSparkFlying.emitter = spawnLocation;

    // Uses texture: light_01.png
    const collisionCircle = ParticleSystem.Parse(collisionCirclejson, this.scene, '');
    collisionCircle.particleTexture = new Texture(merge03); // LINK THIS TO: light_01.png
    collisionCircle.emitter = spawnLocation;

    // Uses texture: Circle_05.png
    const collisionStayOrb = ParticleSystem.Parse(collisionStayOrbJson, this.scene, '');
    collisionStayOrb.particleTexture = new Texture(dotTexture); // LINK THIS TO: circle_05.png
    collisionStayOrb.emitter = spawnLocation;
    collisionStayOrb.startDelay = 0;

    // Uses Texture: smoke_07.png
    const collisionSmoke = ParticleSystem.Parse(collisionSmokeJson, this.scene, '');
    collisionSmoke.particleTexture = new Texture(smoke); // LINK THIS TO: smoke_07.png
    collisionSmoke.emitter = spawnLocation;
    collisionStayOrb.startDelay = 1;

    const collisionSet = ParticleHelper.ExportSet([
      collisionParticle,
      collisionSmoke,
      collisionStayOrb,
      collisionCircle,
      collisionSparkFlying
    ]);

    //collisionSet.start();
    return collisionSet;
  }
}
