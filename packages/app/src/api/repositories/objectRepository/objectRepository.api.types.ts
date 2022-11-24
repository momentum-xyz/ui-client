import {MetadataInterface, OptionsInterface} from 'api/interfaces';

export interface FetchObjectRequest {
  spaceId: string;
  pluginId: string;
}

export interface GetObjectResponse {
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

export interface ObjectInterface {
  title?: string;
  content?: string;
  render_hash?: string;
  youtube_url?: string;
}
