export interface AttendeesRequest {
  spaceId: string;
}

export interface AttendeesResponse {}

export interface FetchAttendeesRequest extends AttendeesRequest {
  limit?: number;
}
