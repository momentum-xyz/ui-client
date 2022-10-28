import {AttributeInterface, AttributeValueInterface} from 'api/interfaces';

export interface UserAttributesRequest {
  worldId: string;
  userId: string;
}

export interface PluginUserAttributesRequest extends UserAttributesRequest {
  pluginId: string;
}

export interface PluginUserAttributeValueRequest extends PluginUserAttributesRequest {
  attributeName: string;
}

// GET PLUGIN-USER ATTRIBUTES

export interface GetPluginUserAttributesRequest extends PluginUserAttributesRequest {
  attributeNames?: string[];
}

export interface GetPluginUserAttributesResponse extends Array<AttributeInterface> {}

// GET PLUGIN-USER ATTRIBUTE VALUE

export interface GetPluginUserAttributeValueRequest extends PluginUserAttributeValueRequest {}

export interface GetPluginUserAttributeValueResponse extends AttributeValueInterface {}

// CREATE OR UPDATE PLUGIN-USER ATTRIBUTES

export interface CreateOrUpdatePluginUserAttributeValueRequest
  extends PluginUserAttributeValueRequest {
  value: AttributeValueInterface;
}

export interface CreateOrUpdatePluginUserAttributeValueResponse extends AttributeValueInterface {}

// DELETE PLUGIN-USER ATTRIBUTES

export interface DeletePluginUserAttributeValueRequest extends PluginUserAttributeValueRequest {}

export interface DeletePluginUserAttributeValueResponse extends AttributeValueInterface {}
