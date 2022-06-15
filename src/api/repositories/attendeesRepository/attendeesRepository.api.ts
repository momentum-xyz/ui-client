import {RequestInterface} from 'api/interfaces';
import {request} from 'api/request';

import {attendeesRepositoryEndpoints} from './attendeesRepository.api.endpoints';
import {AttendeesResponse, FetchAttendeesRequest} from './attendeesRepository.api.types';

export const fetchAttendees: RequestInterface<FetchAttendeesRequest, AttendeesResponse> = (
  options
) => {
  const {spaceId, limit, ...restOptions} = options;

  const url = `${attendeesRepositoryEndpoints().base}/${spaceId}${
    limit !== undefined ? `/${limit}` : ''
  }`;

  return request.get(url, restOptions);
};
