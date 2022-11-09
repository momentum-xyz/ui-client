import {AttributeValueInterface} from '@momentum-xyz/sdk';

// GET SPACE ATTRIBUTE
export interface GetSpaceAttributeRequest {
  spaceId: string;
  plugin_id: string;
  attribute_name: string;
}

export interface GetSpaceAttributeResponse extends AttributeValueInterface {}

// SET SPACE ATTRIBUTE
export interface SetSpaceAttributeRequest {
  spaceId: string;
  plugin_id: string;
  attribute_name: string;
  value: AttributeValueInterface;
}

export interface SetSpaceAttributeResponse extends AttributeValueInterface {}

// DELETE SPACE ATTRIBUTE
export interface DeleteSpaceAttributeRequest extends GetSpaceAttributeRequest {}

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

// DELETE SPACE SUB ATTRIBUTE
export interface DeleteSpaceSubAttributeRequest extends GetSpaceSubAttributeRequest {}
