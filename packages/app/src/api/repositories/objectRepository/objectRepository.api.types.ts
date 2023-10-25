import {AttributeValueInterface, Transform} from '@momentum-xyz/sdk';

import {MetadataInterface, OptionsInterface} from 'api/interfaces';

/** COMMON **/

export interface CustomizableObjectInterface {
  text: string;
  title: string;
  image_hash: string;
  claimed_by?: string;
  created_at?: string;
}

export interface GetObjectResponse extends AttributeValueInterface {
  title?: string;
  content?: string;
  render_hash?: string;
  youtube_url?: string;
}

export interface ObjectMetadataInterface extends MetadataInterface {
  name: string;
  pluginId: string;
}

export interface ObjectOptionsInterface extends OptionsInterface {}

export interface ObjectInterface extends AttributeValueInterface {
  title?: string;
  content?: string;
  render_hash?: string;
  youtube_url?: string;
}

export interface CreateObjectRequest {
  parent_id: string;
  object_name: string;
  object_type_id: string;

  asset_2d_id?: string;
  asset_3d_id?: string;

  transform?: Transform;

  minimap?: boolean;
}

export interface CreateObjectResponse {
  object_id: string;
}

export interface DeleteObjectRequest {
  objectId: string;
}

export interface FetchWorldMembersRequest {
  worldId: string;
}

export interface CloneObjectRequest {
  objectId: string;
}

export interface CloneObjectResponse {
  object_id: string;
}

export interface WorldMemberInterface {
  user_id: string;
  name: string;
  avatar_hash: string;
  role: string;
}

export interface FetchWorldMembersResponse extends Array<WorldMemberInterface> {}

export interface AddWorldMemberRequest {
  worldId: string;
  address: string;
  role: string;
}

export interface DeleteWorldMemberRequest {
  worldId: string;
  userId: string;
}

export interface WorldObjectWithChildrenInterface {
  id: string;
  name: string;
  object_type_id: string;
  object_type_name: string;
  total_direct_children: number;
  children: Record<string, WorldObjectWithChildrenInterface>;
}

export interface FetchWorldTreeRequest {
  worldId: string;
  max_depth?: number;
  object_type?: string;
}
export interface FetchWorldTreeResponse extends WorldObjectWithChildrenInterface {
  max_depth: number;
}

/** CLAIM AND CUSTOMIZE OBJECT **/

export interface ClaimAndCustomizeRequest extends CustomizableObjectInterface {
  objectId: string;
}

/** CLEAN CUSTOMIZATION AND UNCLAIM OBJECT **/

export interface CleanCustomizationRequest {
  objectId: string;
}

/** SPAWN OBJECT BY USER **/

export interface SpawnByUserRequest {
  objectId: string;
  object_name: string;
  object_type_id: string;
  attributes: Record<string, unknown>;
}

export interface SpawnByUserResponse {
  object_id: string;
}
