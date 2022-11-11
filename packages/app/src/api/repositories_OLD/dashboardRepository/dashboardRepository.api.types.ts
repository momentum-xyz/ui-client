import {PermanentTypeEnum, TileTypeEnum} from 'core/enums';
import {ContentInterface, TileListInterface} from 'core/models';

export interface DashboardRequestInterface {
  spaceId: string;
}

export interface DashboardResponseInterface {}

export interface TilesUpdatePositionInterface {
  data: TileListInterface;
}

export interface CreateTileDataRequest {
  type?: TileTypeEnum;
  content?: ContentInterface;
  hash?: string;
  permanentType?: PermanentTypeEnum | null;
  render?: boolean;
  internal?: boolean;
  column?: number;
  row?: number;
}

export interface CreateTileResponse {}

export interface CreateTileRequest {
  data: CreateTileDataRequest;
  spaceId: string;
}

export interface UpdateTileResponse {}

export interface UpdateTileRequest {
  data: CreateTileDataRequest;
  tileId: string;
}

export interface UploadTileImageResponse {
  hash: string;
}

export interface DeleteTileResponse {}
export interface DeleteTileRequest {
  tileId: string;
}
