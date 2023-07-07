/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Color3,
    MeshBuilder,
    ParticleSystem,
    Scene,
    StandardMaterial,
    Texture,
    TrailMesh,
    Vector3
} from "@babylonjs/core";

import pentagon from '../static/Particles/pentagon.png';

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
        this.sphere = MeshBuilder.CreateSphere('sphere', { diameter: .65 }, scene);

        const sphereMaterial = new StandardMaterial('sphereMaterial', scene);
        sphereMaterial.diffuseColor = Color3.Blue();
        sphereMaterial.alpha = .3;
        this.sphere.material = sphereMaterial;

        if (trail) {
            this.trail = new TrailMesh("WhispTrail", this.sphere, scene, .1, 40);
        }
    }

    /**
     * Create outward facing light beam particles
     * @param {Scene} scene The scene
     * @protected
     */
    protected createParticlesBeams(scene: Scene) {

    }

    /**
     * Create raising sparks particles
     * @param {Scene} scene The scene
     * @protected
     */
    protected createParticlesSparks(scene: Scene) {
        this.particlesSparks = new ParticleSystem("ParticlesSparks", 8, scene);
        this.particlesSparks.emitter = this.sphere;
        this.particlesSparks.particleTexture = new Texture(pentagon, scene);
        this.particlesSparks.minInitialRotation = 0;
        this.particlesSparks.minInitialRotation = Math.PI * 2 / 5;
        this.particlesSparks.minLifeTime = .5;
        this.particlesSparks.maxLifeTime = .8;
        this.particlesSparks.isLocal = true;
        this.particlesSparks.emitRate = 6;

        this.particlesSparks.direction1 = this.particlesSparks.direction2 = new Vector3();

        this.particlesSparks.addSizeGradient(0, 0, 0);
        this.particlesSparks.addSizeGradient(.3, .1, .25);
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