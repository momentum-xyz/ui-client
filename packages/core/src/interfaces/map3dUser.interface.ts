import {TransformNoScaleInterface} from './object.interface';

export interface Map3dUserInterface {
  uuid: string;
  name: string;
  owner?: string | null;
  image?: string | null;
}

// TODO merge these somehow
export interface Odyssey3dUserInterface {
  id: string;
  name: string;
  avatar?: string;
  is_guest?: boolean;
  transform?: TransformNoScaleInterface;
}
