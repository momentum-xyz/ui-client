import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface UploadAsset3dRequest {
  asset: File;
}

export interface UploadAsset3dResponse {
  id: string;
  meta: MetadataInterface;
}
