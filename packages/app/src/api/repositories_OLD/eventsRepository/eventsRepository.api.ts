import {Method} from 'axios';

import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';

import {eventsRepositoryEndpoints} from './eventsRepository.api.endpoints';
import {
  FetchEventRequest,
  FetchEventsResponse,
  FetchEventResponse,
  CreateEventResponse,
  BaseEventsRequest,
  CreateEventRequest,
  UpdateEventRequest,
  UpdateEventResponse,
  DeleteEventRequest,
  DeleteEventResponse,
  UploadFileRequest,
  UploadFileResponse
} from './eventsRepository.api.types';

export const fetchEvents: RequestInterface<BaseEventsRequest, FetchEventsResponse> = (options) => {
  const {spaceId, children, ...restOptions} = options;
  const url = eventsRepositoryEndpoints().base + `/${spaceId}`;

  return request.get(url, {...restOptions, params: {children: children}});
};

export const fetchEvent: RequestInterface<FetchEventRequest, FetchEventResponse> = (options) => {
  const {spaceId, eventId, ...restOptions} = options;
  const url = eventsRepositoryEndpoints().base + `/${spaceId}/${eventId}`;

  return request.get(url, restOptions);
};

export const createEvent: RequestInterface<CreateEventRequest, CreateEventResponse> = (options) => {
  const {data, spaceId, ...rest} = options;
  const requestParams = {
    method: 'post' as Method,
    data,
    ...rest
  };
  const url = eventsRepositoryEndpoints().base + `/${spaceId}`;

  return request(url, requestParams);
};

export const updateEvent: RequestInterface<UpdateEventRequest, UpdateEventResponse> = (options) => {
  const {spaceId, eventId, data, ...restOptions} = options;
  const url = eventsRepositoryEndpoints().base + `/${spaceId}/${eventId}`;

  return request.put(url, data, restOptions);
};

export const deleteEvent: RequestInterface<DeleteEventRequest, DeleteEventResponse> = (options) => {
  const {spaceId, eventId, ...restOptions} = options;
  const url = eventsRepositoryEndpoints().base + `/${spaceId}/${eventId}`;

  return request.delete(url, restOptions);
};

export const uploadImage: RequestInterface<UploadFileRequest, UploadFileResponse> = (options) => {
  const {file, spaceId, eventId, ...restOptions} = options;

  const formData: FormData = new FormData();
  formData.append('file', file);

  const requestParams = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...restOptions
  };

  const URL = `${eventsRepositoryEndpoints().base}/${spaceId}/${eventId}/image`;
  return request.post(URL, formData, requestParams);
};
