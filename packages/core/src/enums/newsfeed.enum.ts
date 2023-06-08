export enum NewsfeedTypeEnum {
  CREATED = 'created',
  CONNECTED = 'connected',
  CALENDAR = 'calendar',
  BOOST = 'boost',
  IMAGE = 'image',
  SCREENSHOT = 'screenshot',
  VIDEO = 'video',
  EVENT = 'event'
}

export enum PostTypeEnum {
  SCREENSHOT = NewsfeedTypeEnum.SCREENSHOT,
  VIDEO = NewsfeedTypeEnum.VIDEO,
  EVENT = NewsfeedTypeEnum.EVENT
}

export interface NewsFeedMediaEntryDataInterface {
  image: string | null;
  video: string | null;
  world_id: string | null;
  comment: string | null;
}
