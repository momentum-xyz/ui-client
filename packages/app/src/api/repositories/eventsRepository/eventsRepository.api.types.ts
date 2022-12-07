import {UserModelInterface} from 'core/models';

export interface EventCreateRequest {
  data: EventInterface;
  spaceId: string;
  eventId: string;
}

export interface EventDeleteRequest {
  eventId: string;
  spaceId: string;
}

export interface FetchEventsRequest {
  spaceId: string;
}

export interface GetEventRequest {
  spaceId: string;
  eventId: string;
}

export interface EventInterface {
  eventId?: string;
  spaceId?: string;
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
