import {Asset3dCategoryEnum} from 'api/enums';
import {MetadataInterface} from 'api/interfaces/metadata.interface';

interface Asset3dRequest {
  worldId: string;
}

export interface UploadAsset3dRequest extends Asset3dRequest {
  asset: File;
  name: string;
}

export interface UploadAsset3dResponse {
  id: string;
  meta: MetadataInterface;
}

export interface Asset3dMetadataInterface {
  name: string;
  type: number;
  category: Asset3dCategoryEnum;
  previewImage?: string;
}

export interface Asset3dInterface {
  id: string;
  meta: Asset3dMetadataInterface;
  createdAt: string;
  updatedAt: string;
}

export interface FetchAssets3dRequest extends Asset3dRequest {
  category: Asset3dCategoryEnum;
}

export interface FetchAssets3dResponse extends Array<Asset3dInterface> {}

export interface DeleteAsset3dRequest extends Asset3dRequest {
  assetId: string;
}
