import {UserModelInterface} from 'core/models';

export interface EventCreateRequest {
  data: EventInterface;
  objectId: string;
  eventId: string;
}

export interface EventDeleteRequest {
  eventId: string;
  objectId: string;
}

export interface FetchEventsRequest {
  objectId: string;
}

export interface GetEventRequest {
  objectId: string;
  eventId: string;
}

export interface EventInterface {
  eventId?: string;
  objectId?: string;
  ownerId?: string;
  spaceName?: string;
  start?: Date;
  end?: Date;
  title?: string;
  hosted_by?: string;
  web_link?: string | null;
  description?: string;
  image?: string;
  attendees?: UserAttributeInterface;
}

export interface UserAttributeInterface {
  [userId: string]: UserModelInterface;
}
