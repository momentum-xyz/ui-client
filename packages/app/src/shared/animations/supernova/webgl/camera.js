/* eslint-disable */
// @ts-nocheck
import {Matrix4} from '../math/matrix4.js';
import {Vector3} from '../math/vector3.js';

export class Camera {
  static UP = Object.freeze(new Vector3(0, 1, 0));
  static ANGLE = Math.PI * 0.3;
  static Z_NEAR = 0.02;
  static Z_FAR = 50;

  projection = new Matrix4();
  view = new Matrix4();
  vp = new Matrix4();

  updateProjection(aspect, angle = Camera.ANGLE) {
    this.projection.perspective(angle, aspect, Camera.Z_NEAR, Camera.Z_FAR);
  }

  updateVP() {
    this.vp.set(this.projection);
    this.vp.multiply(this.view);
  }
}
