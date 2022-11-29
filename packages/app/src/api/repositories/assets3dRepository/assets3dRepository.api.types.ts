import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface UploadAsset3dRequest {
  asset: File;
}

export interface UploadAsset3dResponse {
  id: string;
  meta: MetadataInterface;
}

export interface Asset3dMetadataInterface {
  name: string;
  type: number;
  category: string;
  previewImage?: string;
}

export interface Asset3dInterface {
  id: string;
  meta: Asset3dMetadataInterface;
  createdAt: string;
  updatedAt: string;
}
export interface FetchAssets3dResponse extends Array<Asset3dInterface> {}
