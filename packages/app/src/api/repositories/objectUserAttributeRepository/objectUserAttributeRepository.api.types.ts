import {AttributeValueInterface} from '@momentum-xyz/sdk';

export interface ObjectUserAttributeRequest {
  objectId: string;
  userId: string;
  attributeName: string;
  pluginId: string;
}

export interface ObjectUserSubAttributeRequest {
  objectId: string;
  userId: string;
  attributeName: string;
  pluginId: string;
  sub_attribute_key: string;
}

/** GET OBJECT USER ATTRIBUTE **/

export interface GetObjectUserAttributeRequest extends ObjectUserAttributeRequest {}

export interface GetObjectUserAttributeResponse extends AttributeValueInterface {}

/** SET OBJECT USER ATTRIBUTE REQUEST */

export interface SetObjectUserAttributeRequest extends ObjectUserAttributeRequest {
  value: unknown;
}

export interface SetObjectUserAttributeResponse extends AttributeValueInterface {}

/** DELETE OBJECT USER ATTRIBUTE REQUEST */

export interface DeleteObjectUserAttributeRequest extends ObjectUserAttributeRequest {}

export interface DeleteObjectUserAttributeResponse extends AttributeValueInterface {}

/** GET OBJECT USER ATTRIBUTE COUNT **/

export interface GetObjectUserAttributeCountRequest
  extends Omit<ObjectUserAttributeRequest, 'userId'> {}

export interface GetObjectUserAttributeCountResponse {
  count: number;
}

/** GET ALL OBJECT-USER ATTRIBUTES FOR GIVEN OBJECT **/

export interface GetAllObjectUserAttributesForObjectRequest
  extends Omit<ObjectUserAttributeRequest, 'userId'> {}

export interface GetAllObjectUserAttributesForObjectResponse {
  [userId: string]: AttributeValueInterface;
}

/** GET ALL OBJECT-USER ATTRIBUTES LIST **/

export interface GetAllObjectUserAttributeListRequest
  extends Omit<ObjectUserAttributeRequest, 'userId'> {
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
  orderDirection?: 'ASC' | 'DESC';
  filterField?: string;
  filterValue?: string;
  q?: string;
}

export interface GetAllObjectUserAttributeListResponse {
  count: number;
  limit: number;
  offset: number;
  items: unknown[] | null;
}

/** SET OBJECT USER SUB ATTRIBUTE REQUEST */

export interface SetObjectUserSubAttributeRequest extends ObjectUserSubAttributeRequest {
  sub_attribute_value: unknown;
}

export interface SetObjectUserSubAttributeResponse extends AttributeValueInterface {}

/** DELETE OBJECT USER SUB ATTRIBUTE REQUEST */

export interface DeleteObjectUserSubAttributeRequest extends ObjectUserSubAttributeRequest {}
