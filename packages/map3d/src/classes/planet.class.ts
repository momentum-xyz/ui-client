import * as THREE from 'three';

export class PlanetMesh extends THREE.Mesh {
  material: any;
  geometry: any;
  uuid: string;
  wallet: string;
  name: string;
  url: string;
  isOdyssey: boolean;

  constructor(
    geometry: any,
    material: any,
    uuid: string,
    wallet: string,
    name: string,
    url: string
  ) {
    super(geometry, material);

    this.material = material;
    this.geometry = geometry;
    this.uuid = uuid;
    this.wallet = wallet;
    this.name = name;
    this.url = url;
    this.isOdyssey = true;
  }
}
