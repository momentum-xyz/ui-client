import {AttributeNameEnum} from '@momentum-xyz/sdk';

import {PluginIdEnum} from 'api/enums';
import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';
import {
  deleteObjectAttributeItem,
  getObjectAttribute,
  getObjectAttributeItem,
  setObjectAttributeItem
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
  const {objectId, eventId, data, ...restOptions} = options;

  const attributeOptions: SetObjectAttributeItemRequest = {
    objectId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    sub_attribute_key: eventId,
    value: data,
    ...restOptions
  };

  return setObjectAttributeItem(attributeOptions, request);
};

export const deleteEventAttribute: RequestInterface<EventDeleteRequest, null> = (options) => {
  const {eventId, objectId, ...restOptions} = options;

  const attributeOptions: DeleteObjectAttributeItemRequest = {
    objectId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    sub_attribute_key: eventId,
    ...restOptions
  };
  return deleteObjectAttributeItem(attributeOptions, request);
};

export const getEventAttribute: RequestInterface<
  GetEventRequest,
  ObjectAttributeItemResponse | null
> = (options) => {
  const {objectId, eventId, ...restOptions} = options;

  const attributeOptions: GetObjectAttributeItemRequest = {
    objectId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    sub_attribute_key: eventId,
    ...restOptions
  };

  return getObjectAttributeItem(attributeOptions, request);
};

export const getEventAttributes: RequestInterface<
  FetchEventsRequest,
  GetObjectAttributeResponse | null
> = (options) => {
  const {objectId, ...restOptions} = options;

  const attributeOptions: GetObjectAttributeRequest = {
    objectId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    ...restOptions
  };

  return getObjectAttribute(attributeOptions, request);
};
