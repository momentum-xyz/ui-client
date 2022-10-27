export interface SpaceInterface {
  name: string;
}

export interface FetchSpaceRequest {
  spaceId: string;
}

export interface FetchSpaceResponse extends SpaceInterface {}
