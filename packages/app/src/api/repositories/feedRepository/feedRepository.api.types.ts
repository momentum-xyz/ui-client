/** COMMON **/

export interface NftFeedItemInterface {
  id: number;
  collectionId: number;
  owner: string;
  uuid: string;
  name: string;
  description: string | undefined;
  image: string;

  date: string;
  type: 'created' | 'connected' | 'docked';
  connectedTo?: NftFeedItemInterface;
  dockedTo?: NftFeedItemInterface;
}

/** FETCH NEWS FEED **/

export interface NewsFeedRequest {}

export interface NewsFeedResponse extends Array<NftFeedItemInterface> {}

/** FETCH NOTIFICATIONS **/

export interface NotificationRequest {}

export interface NotificationResponse extends Array<NftFeedItemInterface> {}
