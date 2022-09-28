import {UserInterface} from 'api';

export interface AttendeesRequestInterface {
  eventId: string;
  spaceId: string;
}

export interface AttendeeInterface {
  user: UserInterface;
}

export interface AttendeesResponseInterface {
  count: number;
  attendees: AttendeeInterface[];
}

export interface FetchAttendeesRequestInterface extends AttendeesRequestInterface {
  limit?: boolean;
  query?: string;
}
