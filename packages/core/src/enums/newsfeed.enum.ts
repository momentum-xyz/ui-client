export enum NewsfeedTypeEnum {
  CREATED = 'created',
  CONNECTED = 'connected',
  CALENDAR = 'calendar',
  BOOST = 'boost',
  IMAGE = 'image',
  VIDEO = 'video',
  EVENT = 'event'
}

export enum PostTypeEnum {
  IMAGE = NewsfeedTypeEnum.IMAGE,
  VIDEO = NewsfeedTypeEnum.VIDEO,
  EVENT = NewsfeedTypeEnum.EVENT
}

export interface NewsFeedMediaEntryDataInterface {
  image: string | null;
  video: string | null;
  world_id: string | null;
  comment: string | null;
}
