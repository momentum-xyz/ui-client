import {PluginTypeEnum} from '@momentum-xyz/sdk';
import {IconNameType} from '@momentum-xyz/ui-kit-storybook';

import {OptionsInterface} from 'api/interfaces';
import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface PluginRequest {
  pluginId: string;
}

export interface PluginMetadataInterface extends MetadataInterface {
  scriptUrl: string;
  scopeName: string;
  name: string;
  pluginId: string;
}

export interface PluginOptionsInterface extends OptionsInterface {
  exact?: boolean;
  iconName: IconNameType;
}

export interface PluginUUIDsInterface {
  ids: string[];
}

// GET PLUGINS LIST

export interface GetPluginsListRequest {
  ids?: string[];
  type?: PluginTypeEnum;
}

/**
 * [pluginId: string]: [plugin_name: string]
 */
export interface GetPluginsListResponse {
  [pluginIds: string]: string;
}

// SEARCH PLUGINS

export interface SearchPluginsRequest {
  name?: string;
  description?: string;
  type?: PluginTypeEnum;
}

// GET METADATA OF PLUGINS

export interface GetPluginsMetadataRequest extends PluginUUIDsInterface {}

/**
 * [pluginId: string]: [metadata: MetadataInterface]
 */
export interface GetPluginsMetadataResponse extends Record<string, PluginMetadataInterface> {}

// GET OPTIONS OF PLUGINS

export interface GetPluginsOptionsRequest extends PluginUUIDsInterface {}

/**
 * [pluginId: string]: [options: OptionsInterface]
 */
export interface GetPluginsOptionsResponse extends Record<string, PluginOptionsInterface> {}
