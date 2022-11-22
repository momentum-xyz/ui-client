import {OptionsInterface} from 'api/interfaces';
import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface Asset2DRequest {
  assetId: string;
}

export interface Asset2DResponse<
  M extends MetadataInterface = MetadataInterface,
  O extends OptionsInterface = OptionsInterface
> {
  meta: M;
  options: O;
}
