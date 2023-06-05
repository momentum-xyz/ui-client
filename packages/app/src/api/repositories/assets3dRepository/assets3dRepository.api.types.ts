import {Asset3dCategoryEnum} from 'api/enums';
import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface UploadAsset3dRequest {
  asset: File;
  name: string;
  preview_hash?: string;
  is_private?: boolean;
}

export interface UploadAsset3dResponse {
  id: string;
  meta: MetadataInterface;
}

export interface PatchAsset3dRequest {
  assetId: string;
  name?: string;
  preview_hash?: string;
}

export interface Asset3dMetadataInterface {
  name: string;
  type: number;
  category: Asset3dCategoryEnum;
  preview_hash?: string;
}

export interface Asset3dInterface {
  id: string;
  meta: Asset3dMetadataInterface;
  is_private: boolean;
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchAssets3dRequest {
  category: Asset3dCategoryEnum;
}

export interface FetchAssets3dResponse extends Array<Asset3dInterface> {}
