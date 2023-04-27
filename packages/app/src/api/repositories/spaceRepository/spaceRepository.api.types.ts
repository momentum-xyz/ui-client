export interface SpaceInterface {
  name: string;
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
