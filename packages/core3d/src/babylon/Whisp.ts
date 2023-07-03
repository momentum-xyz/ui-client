import {Color3, MeshBuilder, Scene, StandardMaterial, Vector3} from "@babylonjs/core";

export class Whisp {
    protected readonly sphere;
    protected readonly position = new Vector3(2, 2, 2);

    /**
     * Construct a whisp
     */
    constructor(scene: Scene) {
        this.sphere = MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);

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
    }
}