import * as THREE from 'three';
import {SphereGeometry} from 'three/src/geometries/SphereGeometry';
import {MeshPhysicalMaterial} from 'three/src/materials/MeshPhysicalMaterial';

export class PlanetMesh extends THREE.Mesh {
  geometry: SphereGeometry;
  material: MeshPhysicalMaterial;
  uuid: string;
  owner: string;
  name: string;
  texture: THREE.Texture;
  nameRingMaterial: THREE.MeshBasicMaterial;
  isOdyssey: boolean;

  constructor(
    geometry: SphereGeometry,
    material: MeshPhysicalMaterial,
    uuid: string,
    owner: string,
    name: string,
    texture: THREE.Texture,
    nameRingMaterial: THREE.MeshBasicMaterial
  ) {
    super(geometry, material);

    this.geometry = geometry;
    this.material = material;
    this.uuid = uuid;
    this.owner = owner;
    this.name = name;
    this.texture = texture;
    this.nameRingMaterial = nameRingMaterial;
    this.isOdyssey = true;
  }
}
