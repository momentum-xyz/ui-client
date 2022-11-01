import {AttributeValueInterface} from 'api/interfaces';

// GET SPACE ATTRIBUTE
export interface GetSpaceAttributeRequest {
  spaceId: string;
  plugin_id: string;
  attribute_name: string;
}

export interface GetSpaceAttributeResponse extends AttributeValueInterface {}

// GET SPACE SUB ATTRIBUTE
export interface GetSpaceSubAttributeRequest extends GetSpaceAttributeRequest {
  sub_attribute_key: string;
}

// SET SPACE SUB ATTRIBUTE
export interface SetSpaceSubAttributeRequest extends GetSpaceSubAttributeRequest {
  value: unknown;
}

export interface SpaceSubAttributeResponse {
  [sub_attribute_key: string]: unknown;
}
