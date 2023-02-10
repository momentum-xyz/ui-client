import {NewsfeedTypeEnum} from 'core/enums';

/** COMMON **/

export interface NewsfeedItemInterface {
  uuid: string;
  date: string;
  type: NewsfeedTypeEnum;

  connectedTo?: {
    uuid: string;
    isMutual: boolean;
  };

  calendar?: {
    id: string;
    title: string;
    start: string;
    end: string;
    image: string;
  };
}

/** FETCH NEWS FEED **/

export interface NewsfeedRequest {}

export interface NewsfeedResponse {
  items: NewsfeedItemInterface[];
}

/** CREATE NEWS FEED ITEM **/

export interface CreateNewsfeedRequest {
  item: NewsfeedItemInterface;
}

export interface CreateNewsfeedResponse {}

/** FETCH NOTIFICATIONS **/

export interface NotificationRequest {}

export interface NotificationResponse extends Array<NewsfeedItemInterface> {}
