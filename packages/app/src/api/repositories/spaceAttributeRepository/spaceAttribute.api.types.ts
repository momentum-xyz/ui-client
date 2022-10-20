import {AttributeInterface, AttributeValueInterface} from 'api/interfaces';

export interface SpaceAttributesRequest {
  worldId: string;
  spaceId: string;
}

export interface PluginAttributesRequest extends SpaceAttributesRequest {
  pluginId: string;
}

export interface PluginAttributeValueRequest extends PluginAttributesRequest {
  attributeName: string;
}

// GET PLUGIN ATTRIBUTES

export interface GetPluginAttributesRequest extends PluginAttributesRequest {
  attributeNames?: string[];
}

export interface GetPluginAttributesResponse extends Array<AttributeInterface> {}

// GET PLUGIN ATTRIBUTE VALUE

export interface GetPluginAttributeValueRequest extends PluginAttributeValueRequest {}

export interface GetPluginAttributeValueResponse extends AttributeValueInterface {}

// CREATE OR UPDATE PLUGIN ATTRIBUTES

export interface CreateOrUpdatePluginAttributeValueRequest extends PluginAttributeValueRequest {
  value: AttributeValueInterface;
}

export interface CreateOrUpdatePluginAttributeValueResponse extends AttributeValueInterface {}

// DELETE PLUGIN ATTRIBUTES

export interface DeletePluginAttributeValueRequest extends PluginAttributeValueRequest {}

export interface DeletePluginAttributeValueResponse extends AttributeValueInterface {}
