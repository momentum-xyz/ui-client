import {Color3, MeshBuilder, Scene, StandardMaterial} from "@babylonjs/core";

export class Whisp {
    protected readonly sphere;

    /**
     * Construct a whisp
     */
    constructor(scene: Scene) {
        this.sphere = MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene);

        const sphereMaterial = new StandardMaterial('sphereMaterial', scene);
        sphereMaterial.diffuseColor = Color3.Blue();
        this.sphere.material = sphereMaterial;
    }

    /**
     * Update the state
     * @param {number} delta The time delta in seconds
     */
    update(delta: number) {

    }
}