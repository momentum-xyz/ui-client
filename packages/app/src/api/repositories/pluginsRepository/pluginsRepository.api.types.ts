import {IconNameType} from '@momentum-xyz/ui-kit';

import {OptionsInterface} from 'api/interfaces';
import {MetadataInterface} from 'api/interfaces/metadata.interface';

export interface PluginRequest {
  pluginId: string;
}

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

export interface PluginUUIDsInterface {
  plugin_uuids: string[];
}

// GET PLUGINS LIST

export interface GetPluginsListRequest {}

/**
 * [plugin_uuid: string]: [plugin_name: string]
 */
export interface GetPluginsListResponse {
  [plugin_uuid: string]: string;
}

// GET METADATA OF PLUGINS

export interface GetPluginsMetadataRequest extends PluginUUIDsInterface {}

/**
 * [plugin_uuid: string]: [metadata: MetadataInterface]
 */
export interface GetPluginsMetadataResponse extends Record<string, PluginMetadataInterface> {}

// GET OPTIONS OF PLUGINS

export interface GetPluginsOptionsRequest extends PluginUUIDsInterface {}

/**
 * [plugin_uuid: string]: [options: OptionsInterface]
 */
export interface GetPluginsOptionsResponse extends Record<string, PluginOptionsInterface> {}
