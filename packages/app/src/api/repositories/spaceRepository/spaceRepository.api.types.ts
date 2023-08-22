/** COMMON **/
export interface SpaceInterface {
  name: string;
}

export interface CustomizableObjectInterface {
  text: string;
  title: string;
  image_hash: string;
  claimed_by?: string;
  created_at?: string;
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
