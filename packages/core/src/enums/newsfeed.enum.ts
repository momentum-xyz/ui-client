export enum NewsfeedTypeEnum {
  CREATED = 'created',
  CONNECTED = 'connected',
  CALENDAR = 'calendar',
  BOOST = 'boost',
  IMAGE = 'image',
  VIDEO = 'video',
  EVENT = 'event',
}

export interface NewsFeedMediaEntryDataInterface {
  image: string | null;
  video: string | null;
  world_id: string | null;
  comment: string | null;
}
