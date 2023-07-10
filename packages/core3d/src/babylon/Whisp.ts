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
    Color4,
    Engine, FresnelParameters, TransformNode, Quaternion, Matrix,
} from "@babylonjs/core";

import pentagon from '../static/Particles/pentagon.png';
import beam from '../static/Particles/beam.png';

export class Whisp {
    public static readonly RADIUS = .24;

    private static readonly ANIMATION_SPEED = .09;
    private static readonly FLOAT_PHASES = [3, 2, 4];
    private static readonly FLOAT_MAGNITUDE = .18;

    private readonly float;
    private trail?: TrailMesh;
    private particlesBeams?: ParticleSystem;
    private particlesSparks?: ParticleSystem;

    protected readonly node = new TransformNode("WhispRoot");
    protected readonly velocity = new Vector3();
    protected readonly direction = new Vector3(0, 0, 1);
    protected readonly directionAngles = new Vector3();
    protected readonly sphere;
    protected readonly position = new Vector3(2, 2, 2);
    protected animationPhase = Math.random();

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
            subdivisions: 2,
            radius: Whisp.RADIUS
        }, scene);
        this.sphere.parent = this.node;

        const sphereMaterial = new StandardMaterial('SphereMaterial', scene);

        sphereMaterial.diffuseColor = new Color3(.8, .8, 1);
        sphereMaterial.alpha = .5;
        sphereMaterial.alphaMode = Engine.ALPHA_ADD;
        sphereMaterial.reflectionFresnelParameters = new FresnelParameters();
        sphereMaterial.reflectionFresnelParameters.power = 3;
        sphereMaterial.reflectionFresnelParameters.leftColor =
            sphereMaterial.reflectionFresnelParameters.rightColor =
                Color3.White();

        this.sphere.material = sphereMaterial;

        if (trail) {
            this.trail = new TrailMesh("WhispTrail", this.node, scene, .07, 60);

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
        this.particlesBeams.addColorGradient(.5, new Color4(1, 1, 1, .6));
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
        this.particlesSparks.addSizeGradient(.5, .1, .28);
        this.particlesSparks.addSizeGradient(1, 0, 0);

        this.particlesSparks.minEmitBox = new Vector3(-.07, -.07, -.07);
        this.particlesSparks.maxEmitBox = this.particlesSparks.minEmitBox.clone().negate();

        this.particlesSparks.start();
    }

    /**
     * Update the state
     * @param {number} delta The time delta in seconds
     */
    update(delta: number) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
        this.position.z += this.velocity.z * delta;

        this.node.position.x = this.position.x;
        this.node.position.y = this.position.y;
        this.node.position.z = this.position.z;

        if (this.velocity.length() !== 0) {
            this.direction.copyFrom(this.velocity).normalize();
            this.directionAngles.set(
                0,
                Math.atan2(this.direction.x, this.direction.z) + Math.PI * .5,
                Math.asin(-this.direction.y));
        }

        if (this.float) {
            const angle = Math.PI * 2 * this.animationPhase *
                Whisp.FLOAT_PHASES[0];
            const radius = Math.sin(Math.PI * 2 * this.animationPhase *
                Whisp.FLOAT_PHASES[1]) * Whisp.FLOAT_MAGNITUDE;

            this.node.position.x += Math.cos(angle) * radius;
            this.node.position.y += Math.sin(Math.PI * 2 * this.animationPhase *
                Whisp.FLOAT_PHASES[2]) * Whisp.FLOAT_MAGNITUDE;
            this.node.position.z += Math.sin(angle) * radius;
        }

        if ((this.animationPhase += Whisp.ANIMATION_SPEED * delta) > 1) {
            --this.animationPhase;
        }
    }
}