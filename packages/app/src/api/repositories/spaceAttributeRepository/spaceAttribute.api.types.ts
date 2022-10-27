import {AttributeSubValueInterface, AttributeValueInterface} from 'api/interfaces';

export interface SpaceAttributesRequest {
  worldId: string;
  spaceId: string;
}

// GET SPACE ATTRIBUTE
export interface GetSpaceAttributeRequest extends SpaceAttributesRequest {
  plugin_id: string;
  attribute_name: string;
}

export interface GetSpaceAttributeResponse extends AttributeValueInterface {}

// GET SPACE SUB ATTRIBUTE
export interface GetSpaceSubAttributeRequest extends SpaceAttributesRequest {
  plugin_id: string;
  attribute_name: string;
  sub_attribute_key: string;
}

export interface GetSpaceSubAttributeResponse extends AttributeSubValueInterface {}

// SET SPACE SUB ATTRIBUTE
export interface SetSpaceSubAttributeRequest extends SpaceAttributesRequest {
  plugin_id: string;
  attribute_name: string;
  sub_attribute_key: string;
  value: unknown;
}

export interface SetSpaceSubAttributeResponse extends AttributeSubValueInterface {}
