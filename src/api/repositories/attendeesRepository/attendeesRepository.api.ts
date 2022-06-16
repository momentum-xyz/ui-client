import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {attendeesRepositoryEndpoints} from './attendeesRepository.api.endpoints';
import {
  AttendeesRequestInterface,
  AttendeesResponseInterface,
  FetchAttendeesRequestInterface
} from './attendeesRepository.api.types';

export const fetchAttendees: RequestInterface<
  FetchAttendeesRequestInterface,
  AttendeesResponseInterface
> = (options) => {
  const {eventId, limit, ...restOptions} = options;

  const url = `${attendeesRepositoryEndpoints().base}/${eventId}${
    limit !== undefined ? `/${limit}` : ''
  }`;

  return request.get(url, restOptions);
};

export const addAttendee: RequestInterface<
  AttendeesRequestInterface,
  AttendeesResponseInterface
> = (options) => {
  const {eventId, ...restOptions} = options;

  const url = `${attendeesRepositoryEndpoints().add}/${eventId}`;

  return request.post(url, {}, restOptions);
};

export const removeAttendee: RequestInterface<
  AttendeesRequestInterface,
  AttendeesResponseInterface
> = (options) => {
  const {eventId, ...restOptions} = options;

  const url = `${attendeesRepositoryEndpoints().remove}/${eventId}`;

  return request.post(url, {}, restOptions);
};
