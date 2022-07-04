import {TileListInterface} from '../../../core/models';

export interface DashboardRequestInterface {
  spaceId: string;
}

export interface DashboardResponseInterface {}

export interface TilesUpdatePositionInterface {
  data: TileListInterface;
}
