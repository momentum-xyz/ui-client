import {IconNameType} from '@momentum-xyz/ui-kit';

import {OptionsInterface} from 'api/interfaces';
import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface PluginMetadataInterface extends MetadataInterface {
  scriptUrl: string;
  scopeName: string;
  name: string;
}

export interface PluginOptionsInterface extends OptionsInterface {
  subPath: string;
  exact?: boolean;
  iconName: IconNameType;
}

// GET METADATA OF PLUGINS

export interface GetPluginsMetadataRequest {
  pluginIds: string[];
}

export interface GetPluginsMetadataResponse extends Array<PluginMetadataInterface> {}

// GET OPTIONS OF PLUGINS

export interface GetPluginsOptionsRequest {
  pluginIds: string[];
}

export interface GetPluginsOptionsResponse extends Array<OptionsInterface> {}
