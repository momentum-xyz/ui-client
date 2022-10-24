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
  const {eventId, spaceId, limit = false, query, ...restOptions} = options;

  const url = `${attendeesRepositoryEndpoints().base}/${spaceId}/${eventId}/${limit}`;

  return request.get(url, {...restOptions, params: {q: query !== '' ? query : undefined}});
};

export const addAttendee: RequestInterface<
  AttendeesRequestInterface,
  AttendeesResponseInterface
> = (options) => {
  const {eventId, spaceId, ...restOptions} = options;

  const url = `${attendeesRepositoryEndpoints().add}/${spaceId}/${eventId}`;

  return request.post(url, {}, restOptions);
};

export const removeAttendee: RequestInterface<
  AttendeesRequestInterface,
  AttendeesResponseInterface
> = (options) => {
  const {eventId, spaceId, ...restOptions} = options;

  const url = `${attendeesRepositoryEndpoints().remove}/${spaceId}/${eventId}`;

  return request.post(url, {}, restOptions);
};
