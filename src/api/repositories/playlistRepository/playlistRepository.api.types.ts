export interface BaseRequestInterface {
  worldId: string;
}

export interface BaseResponseInterface {}

export interface PlaylistResponse {
  order: number;
  spaceId: {
    type: string;
    data: Buffer;
  };
  track: TrackDetail;
  trackId: {
    type: string;
    data: Buffer;
  };
}

export interface TrackDetail {
  file_hash: string;
  id: {
    type: string;
    data: Buffer;
  };
  name: string;
}
