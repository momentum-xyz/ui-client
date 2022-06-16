import {UserStatusEnum} from 'core/enums';

export interface AttendeesRequestInterface {
  eventId: string;
}

export interface AttendeeInterface {
  name: string;
  id: string;
  avatarHash: string;
  status: UserStatusEnum;
}

export interface AttendeesResponseInterface {
  count: number;
  attendees: AttendeeInterface[];
}

export interface FetchAttendeesRequestInterface extends AttendeesRequestInterface {
  limit?: number;
}
