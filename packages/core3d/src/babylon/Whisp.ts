/* eslint-disable @typescript-eslint/no-unused-vars */
import {Color3, MeshBuilder, Scene, StandardMaterial, Vector3} from "@babylonjs/core";

export class Whisp {
    private static readonly ANIMATION_SPEED = .07;
    private static readonly FLOAT_PHASES = [3, 2, 4];
    private static readonly FLOAT_MAGNITUDE = .1;

    private readonly float;

    protected readonly sphere;
    protected readonly position = new Vector3(2, 2, 2);
    protected animationPhase = 0;

    /**
     * Construct a whisp
     * @param {Scene} scene The scene
     * @param {boolean} [float] True if the whisp should have float motion
     */
    constructor(scene: Scene, float = false) {
        this.float = float;
        this.sphere = MeshBuilder.CreateSphere('sphere', { diameter: .65 }, scene);

        const sphereMaterial = new StandardMaterial('sphereMaterial', scene);
        sphereMaterial.diffuseColor = Color3.Blue();
        this.sphere.material = sphereMaterial;
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