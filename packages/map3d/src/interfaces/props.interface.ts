import {PlanetInterface} from './planet.interface';

export interface Map3dPropsInterface {
  currentUserId: string | undefined;
  items: PlanetInterface[];
  connections: Record<string, {id: string}[]>;
  getImageAbsoluteUrl(imageUrlOrHash: string | undefined | null): string | null;
  onSelect: (uuid: string) => void;
}
