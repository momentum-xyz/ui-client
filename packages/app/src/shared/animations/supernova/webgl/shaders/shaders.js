/* eslint-disable */
// @ts-nocheck
import {ShaderStar} from './shaderStar.js';
import {ShaderBeams} from './shaderBeams.js';
import {ShaderOverlay} from './shaderOverlay.js';
import {ShaderParticles} from './shaderParticles.js';
import {ShaderRing} from './shaderRing.js';
import {ShaderGradient} from './shaderGradient.js';

export class Shaders {
  static STAR = new ShaderStar();
  static BEAMS = new ShaderBeams();
  static PARTICLES = new ShaderParticles();
  static RING = new ShaderRing();
  static OVERLAY = new ShaderOverlay();
  static GRADIENT = new ShaderGradient();
}
