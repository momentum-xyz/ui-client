import {AttributeValueInterface} from '@momentum-xyz/sdk';

/** COMMON **/
export interface SpaceInterface {
  name: string;
}

export interface CustomizableObjectInterface extends AttributeValueInterface {
  text: string;
  title: string;
  image_hash: string;
  owner_id?: string;
}

export interface FetchSpaceRequest {
  spaceId: string;
}

export interface FetchSpaceResponse extends SpaceInterface {}

export interface PostSpaceRequest {
  parent_id: string;
  object_name: string;
  object_type_id: string;

  asset_2d_id?: string;
  asset_3d_id?: string;

  minimap?: boolean;
}

export interface PostSpaceResponse {
  object_id: string;
}

export interface DeleteSpaceRequest {
  spaceId: string;
}

export interface DeleteSpaceRequest {}

export interface FetchWorldMembersRequest {
  worldId: string;
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
