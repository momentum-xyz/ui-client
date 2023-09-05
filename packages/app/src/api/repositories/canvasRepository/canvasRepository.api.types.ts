export interface GetUserContributionsRequest {
  objectId: string;
}

export interface GetUserContributionsResponse {
  count: number;
  limit: number;
  offset: number;
}
