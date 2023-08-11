import {AttributeValueInterface} from '@momentum-xyz/sdk';

export interface SpaceUserAttributeRequest {
  spaceId: string;
  userId: string;
  attributeName: string;
  pluginId: string;
}

export interface SpaceUserSubAttributeRequest {
  spaceId: string;
  userId: string;
  attributeName: string;
  pluginId: string;
  sub_attribute_key: string;
}

/** GET SPACE USER ATTRIBUTE **/

export interface GetSpaceUserAttributeRequest extends SpaceUserAttributeRequest {}

export interface GetSpaceUserAttributeResponse extends AttributeValueInterface {}

/** SET SPACE USER ATTRIBUTE REQUEST */

export interface SetSpaceUserAttributeRequest extends SpaceUserAttributeRequest {
  value: unknown;
}

export interface SetSpaceUserAttributeResponse extends AttributeValueInterface {}

/** DELETE SPACE USER ATTRIBUTE REQUEST */

export interface DeleteSpaceUserAttributeRequest extends SpaceUserAttributeRequest {}

export interface DeleteSpaceUserAttributeResponse extends AttributeValueInterface {}

/** GET SPACE USER ATTRIBUTE COUNT **/

export interface GetSpaceUserAttributeCountRequest
  extends Omit<SpaceUserAttributeRequest, 'userId'> {}

export interface GetSpaceUserAttributeCountResponse {
  count: number;
}

/** GET ALL SPACE-USER ATTRIBUTES FOR GIVEN SPACE **/

export interface GetAllSpaceUserAttributesForSpaceRequest
  extends Omit<SpaceUserAttributeRequest, 'userId'> {}

export interface GetAllSpaceUserAttributesForSpaceResponse {
  [userId: string]: AttributeValueInterface;
}

/** GET ALL SPACE-USER ATTRIBUTES LIST **/

export interface GetAllSpaceUserAttributeListRequest
  extends Omit<SpaceUserAttributeRequest, 'userId'> {
  fields?: string[];
  limit?: number;
  offset?: number;
  order?: string;
  orderDirection?: 'ASK' | 'DESC';
  filterField?: string;
  filterValue?: string;
  q?: string;
}

export interface GetAllSpaceUserAttributeListResponse {
  count: number;
  limit: number;
  offset: number;
  items: unknown[] | null;
}

/** SET SPACE USER SUB ATTRIBUTE REQUEST */

export interface SetSpaceUserSubAttributeRequest extends SpaceUserSubAttributeRequest {
  sub_attribute_value: unknown;
}

export interface SetSpaceUserSubAttributeResponse extends AttributeValueInterface {}

/** DELETE SPACE USER SUB ATTRIBUTE REQUEST */

export interface DeleteSpaceUserSubAttributeRequest extends SpaceUserSubAttributeRequest {}
