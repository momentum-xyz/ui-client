/* eslint-disable */
// @ts-nocheck
import {UniformBlock} from './uniformBlock.js';

export class UniformBlockGlobals extends UniformBlock {
  static BINDING = 0;
  static NAME = 'Globals';

  floats;

  constructor() {
    super(96, UniformBlockGlobals.BINDING);

    this.floats = new Float32Array(this.bytes);
  }

  setVP(vp) {
    this.floats.set(vp.buffer);
  }

  setTime(time) {
    this.floats[16] = time;
  }

  setPhase(phase, phaseSpeed) {
    this.floats[17] = phase;
    this.floats[18] = phaseSpeed;
  }

  setTransition(transition) {
    this.floats[19] = transition;
  }

  setAspect(aspect) {
    this.floats[20] = aspect;
  }
}

export const glslGlobals =
  `
    uniform ` +
  UniformBlockGlobals.NAME +
  ` {
        mat4 vp;
        float time;
        float phase;
        float phaseSpeed;
        float transition;
        float aspect;
    };`;
