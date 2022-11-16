export interface EventCreateRequest {
  data: EventItemInterface;
  spaceId: string;
  eventId: string;
}

export interface EventDeleteRequest {
  key: string;
  spaceId: string;
}

export interface FetchEventsRequest {
  spaceId: string;
}

export interface EventItemInterface {
  eventId: string;
  spaceId: string;
  spaceName?: string;
  start: Date;
  end: Date;
  title: string;
  hosted_by?: string;
  web_link?: string | null;
  description: string;
  image?: string;
  attendees?: Array<UserAttributeInterface>;
}

export interface UserAttributeInterface {
  [userId: string]: {
    name: string;
  };
}
