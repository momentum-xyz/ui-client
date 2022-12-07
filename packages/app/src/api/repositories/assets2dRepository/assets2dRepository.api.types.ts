import {OptionsInterface} from 'api/interfaces';
import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface Asset2dRequest {
  assetId: string;
}

export interface Asset2dResponse<
  M extends MetadataInterface = MetadataInterface,
  O extends OptionsInterface = OptionsInterface
> {
  meta: M;
  options: O;
}
