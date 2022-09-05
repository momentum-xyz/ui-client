export interface BaseRequestInterface {
  worldId: string;
}

export interface BaseResponseInterface {}
export interface PlaylistResponse extends Array<TrackInterface> {}

export interface TrackInterface {
  order: number;
  spaceId: {
    type: string;
    data: Buffer;
  };
  track: TrackDetailInterface;
  trackId: {
    type: string;
    data: Buffer;
  };
}

export interface TrackDetailInterface {
  file_hash: string;
  id: {
    type: string;
    data: Buffer;
  };
  name: string;
}
