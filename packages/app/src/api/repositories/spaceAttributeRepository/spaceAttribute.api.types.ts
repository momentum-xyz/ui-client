import {AttributeSubValueInterface, AttributeValueInterface} from 'api/interfaces';

// GET SPACE ATTRIBUTE
export interface GetSpaceAttributeRequest {
  spaceId: string;
  plugin_id: string;
  attribute_name: string;
}

export interface GetSpaceAttributeResponse extends AttributeValueInterface {}

// GET SPACE SUB ATTRIBUTE
export interface GetSpaceSubAttributeRequest {
  spaceId: string;
  plugin_id: string;
  attribute_name: string;
  sub_attribute_key: string;
}

export interface GetSpaceSubAttributeResponse extends AttributeSubValueInterface {}

// SET SPACE SUB ATTRIBUTE
export interface SetSpaceSubAttributeRequest {
  spaceId: string;
  plugin_id: string;
  attribute_name: string;
  sub_attribute_key: string;
  value: unknown;
}

export interface SetSpaceSubAttributeResponse extends AttributeSubValueInterface {}
