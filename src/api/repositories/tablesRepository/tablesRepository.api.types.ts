/** Find table **/

export interface FindTableRequest {
  userId: string;
}

export interface FindTableResponse {
  spaceId: string;
  status: any;
  message: string;
}
