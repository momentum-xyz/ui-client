import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';
import {
  deleteSpaceAttributeItem,
  getObjectAttribute,
  getSpaceAttributeItem,
  setSpaceAttributeItem
} from 'api/repositories/objectAttributeRepository';
import {
  DeleteObjectAttributeItemRequest,
  EventDeleteRequest,
  GetEventRequest,
  GetObjectAttributeItemRequest,
  GetObjectAttributeRequest,
  GetObjectAttributeResponse,
  SetObjectAttributeItemRequest,
  ObjectAttributeItemResponse
} from 'api';

import {EventCreateRequest, FetchEventsRequest} from './eventsRepository.api.types';

export const setEventAttributes: RequestInterface<
  EventCreateRequest,
  GetObjectAttributeResponse | null
> = (options) => {
  const {spaceId, eventId, data, ...restOptions} = options;

  const attributeOptions: SetObjectAttributeItemRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    sub_attribute_key: eventId,
    value: data,
    ...restOptions
  };

  return setSpaceAttributeItem(attributeOptions, request);
};

export const deleteEventAttribute: RequestInterface<EventDeleteRequest, null> = (options) => {
  const {eventId, spaceId, ...restOptions} = options;

  const attributeOptions: DeleteObjectAttributeItemRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    sub_attribute_key: eventId,
    ...restOptions
  };
  return deleteSpaceAttributeItem(attributeOptions, request);
};

export const getEventAttribute: RequestInterface<
  GetEventRequest,
  ObjectAttributeItemResponse | null
> = (options) => {
  const {spaceId, eventId, ...restOptions} = options;

  const attributeOptions: GetObjectAttributeItemRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    sub_attribute_key: eventId,
    ...restOptions
  };

  return getSpaceAttributeItem(attributeOptions, request);
};

export const getEventAttributes: RequestInterface<
  FetchEventsRequest,
  GetObjectAttributeResponse | null
> = (options) => {
  const {spaceId, ...restOptions} = options;

  const attributeOptions: GetObjectAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    ...restOptions
  };

  return getObjectAttribute(attributeOptions, request);
};
