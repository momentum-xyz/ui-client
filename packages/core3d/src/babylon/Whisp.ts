/* eslint-disable @typescript-eslint/no-unused-vars */

import {
    Color3,
    ParticleSystem,
    Scene,
    StandardMaterial,
    Texture,
    TrailMesh,
    Vector3,
    MeshBuilder,
    Color4, CanvasAlphaMode, Engine,
} from "@babylonjs/core";

import pentagon from '../static/Particles/pentagon.png';
import beam from '../static/Particles/beam.png';

export class Whisp {
    private static readonly ANIMATION_SPEED = .07;
    private static readonly FLOAT_PHASES = [3, 2, 4];
    private static readonly FLOAT_MAGNITUDE = .1;

    private readonly float;
    private trail?: TrailMesh;
    private particlesBeams?: ParticleSystem;
    private particlesSparks?: ParticleSystem;

    protected readonly sphere;
    protected readonly position = new Vector3(2, 2, 2);
    protected animationPhase = 0;

    /**
     * Construct a whisp
     * @param {Scene} scene The scene
     * @param {boolean} [trail] True if the whisp should have a trail
     * @param {boolean} [float] True if the whisp should have float motion
     */
    constructor(scene: Scene, trail = false, float = false) {
        this.float = float;
        this.sphere = MeshBuilder.CreateIcoSphere('Sphere', {
            flat: true,
            subdivisions: 1,
            radius: .3
        }, scene);

        const sphereMaterial = new StandardMaterial('SphereMaterial', scene);
        sphereMaterial.diffuseColor = new Color3(.8, .8, 1);
        sphereMaterial.alpha = .15;
        sphereMaterial.alphaMode = Engine.ALPHA_ONEONE;
        this.sphere.material = sphereMaterial;

        if (trail) {
            this.trail = new TrailMesh("WhispTrail", this.sphere, scene, .1, 40);

            const trailMaterial = new StandardMaterial("TrailMaterial", scene);

            trailMaterial.diffuseColor = new Color3(.8, .8, 1);
            trailMaterial.alpha = .15;
            trailMaterial.alphaMode = Engine.ALPHA_ADD;
            trailMaterial.disableLighting = true;
            trailMaterial.emissiveColor = new Color3(1, 1, 1);

            this.trail.material = trailMaterial;
        }
    }

    /**
     * Create outward facing light beam particles
     * @param {Scene} scene The scene
     * @protected
     */
    protected createParticlesBeams(scene: Scene) {
        this.particlesBeams = new ParticleSystem("ParticlesWhispBeams", 8, scene);
        this.particlesBeams.emitter = this.sphere;
        this.particlesBeams.blendMode = ParticleSystem.BLENDMODE_ADD;
        this.particlesBeams.particleTexture = new Texture(beam, scene);
        this.particlesBeams.minInitialRotation = 0;
        this.particlesBeams.minInitialRotation = Math.PI * 2;
        this.particlesBeams.minLifeTime = .5;
        this.particlesBeams.maxLifeTime = 1.2;
        this.particlesBeams.minSize = .65;
        this.particlesBeams.maxSize = 1.6;
        this.particlesBeams.maxAngularSpeed = 1.2;
        this.particlesBeams.minAngularSpeed = -this.particlesBeams.maxAngularSpeed;
        this.particlesBeams.isLocal = true;
        this.particlesBeams.emitRate = 6;

        this.particlesBeams.addColorGradient(0, new Color4(1, 1, 1, 0));
        this.particlesBeams.addColorGradient(.5, new Color4(1, 1, 1, 1));
        this.particlesBeams.addColorGradient(1, new Color4(1, 1, 1, 0));

        this.particlesBeams.direction1 = this.particlesBeams.direction2 = new Vector3();
        this.particlesBeams.minEmitBox = this.particlesBeams.maxEmitBox = new Vector3();

        this.particlesBeams.start();
    }

    /**
     * Create raising sparks particles
     * @param {Scene} scene The scene
     * @protected
     */
    protected createParticlesSparks(scene: Scene) {
        this.particlesSparks = new ParticleSystem("ParticlesWhispSparks", 8, scene);
        this.particlesSparks.emitter = this.sphere;
        this.particlesSparks.blendMode = ParticleSystem.BLENDMODE_ADD;
        this.particlesSparks.particleTexture = new Texture(pentagon, scene);
        this.particlesSparks.minInitialRotation = 0;
        this.particlesSparks.minInitialRotation = Math.PI * 2 / 5;
        this.particlesSparks.minLifeTime = .5;
        this.particlesSparks.maxLifeTime = .8;
        this.particlesSparks.isLocal = true;
        this.particlesSparks.emitRate = 6;

        this.particlesSparks.direction1 = this.particlesSparks.direction2 = new Vector3();

        this.particlesSparks.addSizeGradient(0, 0, 0);
        this.particlesSparks.addSizeGradient(.5, .1, .25);
        this.particlesSparks.addSizeGradient(1, 0, 0);

        this.particlesSparks.minEmitBox = new Vector3(-.1, -.1, -.1);
        this.particlesSparks.maxEmitBox = new Vector3(.1, .1, .1);

        this.particlesSparks.start();
    }

    /**
     * Update the state
     * @param {number} delta The time delta in seconds
     */
    update(delta: number) {
        this.sphere.position.x = this.position.x;
        this.sphere.position.y = this.position.y;
        this.sphere.position.z = this.position.z;

        if (this.float) {
            const angle = Math.PI * 2 * this.animationPhase *
                Whisp.FLOAT_PHASES[0];
            const radius = Math.sin(Math.PI * 2 * this.animationPhase *
                Whisp.FLOAT_PHASES[1]) * Whisp.FLOAT_MAGNITUDE;

            this.sphere.position.x += Math.cos(angle) * radius;
            this.sphere.position.y += Math.sin(Math.PI * 2 * this.animationPhase *
                Whisp.FLOAT_PHASES[2]) * Whisp.FLOAT_MAGNITUDE;
            this.sphere.position.z += Math.sin(angle) * radius;
        }

        if ((this.animationPhase += Whisp.ANIMATION_SPEED * delta) > 1) {
            --this.animationPhase;
        }
    }
}