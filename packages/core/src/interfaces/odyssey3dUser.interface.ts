import {TransformNoScaleInterface} from './object.interface';

export interface Odyssey3dUserInterface {
  id: string;
  name: string;
  avatar?: string;
  is_guest?: boolean;
  transform?: TransformNoScaleInterface;
}

export interface Odyssey3dUserTransformInterface {
  id: string;
  transform: TransformNoScaleInterface;
}
