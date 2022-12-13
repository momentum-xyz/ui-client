export interface PlanetInterface {
  id: number;
  collectionId: number;
  owner: string;
  uuid: string;
  name: string;
  description?: string | undefined;
  image?: string | undefined;
}
