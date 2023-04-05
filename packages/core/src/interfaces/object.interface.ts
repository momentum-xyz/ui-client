import {PositionInterface} from './position.interface';

export interface ObjectTransformInterface {
  position: PositionInterface;
  rotation: PositionInterface;
  scale: PositionInterface;
}

export interface TransformNoScaleInterface {
  position: PositionInterface;
  rotation: PositionInterface;
}

export interface Object3dInterface {
  id: string;
  name: string;
  parentId?: string;
  transform: ObjectTransformInterface;
  asset_3d_id: string;
  asset_2d_id?: string;
  showOnMiniMap?: boolean;
  isEditable?: boolean;
}

export interface ClickPositionInterface {
  x: number;
  y: number;
}
