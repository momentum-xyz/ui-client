/** COMMON **/

export interface NftFeedItemInterface {
  id: number;
  collectionId: number;
  owner: string;
  uuid: string;
  name: string;
  description: string | undefined;
  image: string;

  type: 'created' | 'connected' | 'docked' | 'calendar_event';
  date: string;
  mutual?: boolean;

  calendarId?: string | undefined;
  calendarStart?: string | undefined;
  calendarEnd?: string | undefined;
  calendarImage?: string | undefined;
  calendarTitle?: string | undefined;

  connectedTo?: NftFeedItemInterface;
  dockedTo?: NftFeedItemInterface;
}

/** FETCH NEWS FEED **/

export interface NewsFeedRequest {}

export interface NewsFeedResponse {
  items: NftFeedItemInterface[];
}

/** CREATE NEWS FEED ITEM **/

export interface CreateNewsFeedRequest {
  item: NftFeedItemInterface;
}

export interface CreateNewsFeedResponse {}

/** FETCH NOTIFICATIONS **/

export interface NotificationRequest {}

export interface NotificationResponse extends Array<NftFeedItemInterface> {}
