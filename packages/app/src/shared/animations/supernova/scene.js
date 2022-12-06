/* eslint-disable */
// @ts-nocheck
import {gl} from './webgl/gl.js';
import {UniformBlocks} from './webgl/uniforms/uniformBlocks.js';
import {Camera} from './webgl/camera.js';
import {Vector2} from './math/vector2.js';
import {Star} from './star.js';
import {Shaders} from './webgl/shaders/shaders.js';
import {Vector3} from './math/vector3.js';
import {Beams} from './beams.js';
import {Overlay} from './overlay.js';
import {Color} from './math/color.js';
import {Particles} from './particles.js';
import {Ring} from './ring.js';
import {Gradient} from './gradient.js';

export class Scene {
  static MOUSE_APPROACH = 0.05;
  static MOUSE_SHIFT = 0.2;
  static TRANSITION_SPEED_IMPLOSION = 0.08;
  static TRANSITION_SPEED_EXPLOSION = 0.005;
  static EXPLOSION_EYE = 0.3;
  static STAR_FIELD_ROTATION = 0.03;
  static STAR_FIELD_RADIUS = 3.5;

  camera = new Camera();
  star = new Star();
  beams = new Beams();
  particles = new Particles();
  ring = new Ring();
  gradient = new Gradient();
  overlay = new Overlay();
  eye = new Vector3(0, 0, -3.5);
  target = new Vector3();
  width = 0;
  height = 0;
  mouse = new Vector2();
  focus = this.mouse.copy();
  focusPrevious = this.focus.copy();
  phase = 0;
  phaseSpeed = 0.06;
  transition = 0;
  transitionPrevious = this.transition;
  imploding = false;
  exploding = false;

  constructor() {
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);

    window.addEventListener('keydown', (event) => {
      if (event.key === ' ') this.start();
    });

    Shaders.GRADIENT.setColors(new Color('#3f2f0f'), new Color('#000000'));
  }

  start() {
    if (!this.exploding) this.imploding = true;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    this.camera.updateProjection(this.width / this.height);

    gl.viewport(0, 0, width, height);
  }

  mouseMove(x, y) {
    this.mouse.x = (2 * x) / this.width - 1;
    this.mouse.y = (2 * y) / this.height - 1;
  }

  update() {
    this.focusPrevious.set(this.focus);
    this.transitionPrevious = this.transition;
    this.focus.x += (this.mouse.x - this.focus.x) * Scene.MOUSE_APPROACH;
    this.focus.y += (this.mouse.y - this.focus.y) * Scene.MOUSE_APPROACH;
    this.phase += this.phaseSpeed;

    if (this.imploding) {
      if ((this.transition += Scene.TRANSITION_SPEED_IMPLOSION) > 1) {
        this.transition = this.transitionPrevious = 0;
        this.imploding = false;
        this.exploding = true;

        Shaders.GRADIENT.setColors(new Color('#361344'), new Color('#000000'));

        this.eye.y = Scene.EXPLOSION_EYE;
      }
    }

    if (this.exploding) {
      if ((this.transition += Scene.TRANSITION_SPEED_EXPLOSION) > 1) this.transition = 1;
    }

    UniformBlocks.GLOBALS.setPhase(this.phase, this.phaseSpeed);
  }

  render(time) {
    const transition = this.transitionPrevious + (this.transition - this.transitionPrevious) * time;
    const fy = this.focusPrevious.y + (this.focus.y - this.focusPrevious.y) * time;

    this.target.y = -fy * Scene.MOUSE_SHIFT;

    this.camera.view.lookAt(this.eye, this.target, Camera.UP);
    this.camera.updateVP();

    UniformBlocks.GLOBALS.setVP(this.camera.vp);
    UniformBlocks.GLOBALS.setTime(time);
    UniformBlocks.GLOBALS.setTransition(
      this.exploding ? Math.sin(transition * Math.PI * 0.5) : transition
    );
    UniformBlocks.GLOBALS.setAspect(this.width / this.height);
    UniformBlocks.GLOBALS.upload();

    if (this.exploding) {
      const phase = this.phase + time * this.phaseSpeed;
      const angle = phase * Scene.STAR_FIELD_ROTATION;

      this.eye.x = Math.cos(angle) * Scene.STAR_FIELD_RADIUS;
      this.eye.z = Math.sin(angle) * Scene.STAR_FIELD_RADIUS;

      Shaders.GRADIENT.use();

      gl.depthMask(false);

      this.gradient.draw();

      gl.depthMask(true);

      gl.enable(gl.BLEND);
      gl.depthMask(false);
      gl.disable(gl.DEPTH_TEST);

      if (transition < 0.5) {
        Shaders.RING.use();

        this.ring.draw();
      }

      Shaders.PARTICLES.use();

      this.particles.draw();

      if (transition < 0.25) {
        Shaders.OVERLAY.use();

        this.overlay.draw();
      }

      gl.disable(gl.BLEND);
      gl.depthMask(true);
    } else {
      gl.clear(gl.DEPTH_BUFFER_BIT);

      Shaders.GRADIENT.use();

      gl.depthMask(false);

      this.gradient.draw();

      gl.depthMask(true);

      Shaders.STAR.use();

      this.star.draw();

      gl.enable(gl.BLEND);
      gl.depthMask(false);

      Shaders.BEAMS.use();

      this.beams.draw();

      gl.disable(gl.BLEND);
      gl.depthMask(true);
    }
  }
}
