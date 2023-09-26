import {AttributeValueInterface} from '@momentum-xyz/sdk';

// GET OBJECT ATTRIBUTE
export interface GetObjectAttributeRequest {
  objectId: string;
  plugin_id: string;
  attribute_name: string;
}

export interface GetObjectAttributeResponse extends AttributeValueInterface {}

// SET OBJECT ATTRIBUTE
export interface SetObjectAttributeRequest {
  objectId: string;
  plugin_id: string;
  attribute_name: string;
  value: AttributeValueInterface;
}

export interface SetObjectAttributeResponse extends AttributeValueInterface {}

// DELETE OBJECT ATTRIBUTE
export interface DeleteObjectAttributeRequest extends GetObjectAttributeRequest {}

// GET OBJECT SUB ATTRIBUTE
export interface GetObjectAttributeItemRequest extends GetObjectAttributeRequest {
  sub_attribute_key: string;
}

// SET OBJECT SUB ATTRIBUTE
export interface SetObjectAttributeItemRequest extends GetObjectAttributeItemRequest {
  value: unknown;
}

export interface ObjectAttributeItemResponse {
  [sub_attribute_key: string]: unknown;
}

// DELETE SPACE SUB ATTRIBUTE
export interface DeleteObjectAttributeItemRequest extends GetObjectAttributeItemRequest {}
