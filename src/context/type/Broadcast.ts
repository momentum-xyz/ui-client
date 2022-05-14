export interface BroadcastDTO {
  id?: string;
  owner_id: string;
  data: {
    url: string;
    youtubeUrl: string;
    broadcastStatus: BroadcastStatus;
  };
}

export enum BroadcastStatus {
  FORCE_SMALL = 'force_small',
  PLAY_SMALL = 'play_small',
  FORCE_LARGE = 'force_large',
  PLAY_LARGE = 'play_large',
  PLAY = 'play',
  STOP = 'stop'
}
