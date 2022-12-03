import {AttributeValueInterface} from '@momentum-xyz/sdk';

export interface SpaceUserAttributeRequest {
  spaceId: string;
  userId: string;
  attributeName: string;
  pluginId: string;
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
