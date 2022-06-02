export interface BaseRequestInterface {
  worldId: string;
}

export interface BaseResponseInterface {}
export interface PlaylistResponse extends Array<Track> {}

export interface Track {
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
