/* eslint-disable @typescript-eslint/no-unused-vars */
import {Scene, Vector3} from '@babylonjs/core';

import {Whisp} from './Whisp';

export class WispUniversal extends Whisp {
  constructor(scene: Scene, initialPosition: Vector3) {
    super(scene, true, true);

    this.position.x = initialPosition.x;
    this.position.y = initialPosition.y;
    this.position.z = initialPosition.z;

    this.node.position.x = initialPosition.x;
    this.node.position.y = initialPosition.y;
    this.node.position.z = initialPosition.z;

    this.createParticlesBeams(scene);
    this.createParticlesSparks(scene);
    // this.createParticlesStars(scene);
  }
}
