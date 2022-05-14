/** Fetch allowed space types **/

export interface GetAllowedSpaceTypesRequest {
  spaceId: string;
}

export interface GetAllowedSpaceTypesResponse extends Array<string> {}
