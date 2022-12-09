import {AttributeValueInterface} from '@momentum-xyz/sdk';

import {MetadataInterface, OptionsInterface} from 'api/interfaces';

export interface FetchObjectRequest {
  spaceId: string;
  pluginId: string;
}

export interface GetObjectResponse extends AttributeValueInterface {
  title?: string;
  content?: string;
  render_hash?: string;
  youtube_url?: string;
}

export interface ObjectMetadataInterface extends MetadataInterface {
  name: string;
  pluginId: string;
}

export interface ObjectOptionsInterface extends OptionsInterface {}

export interface ObjectInterface extends AttributeValueInterface {
  title?: string;
  content?: string;
  render_hash?: string;
  youtube_url?: string;
}
