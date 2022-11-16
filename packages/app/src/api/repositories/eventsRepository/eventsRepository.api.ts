import {request} from 'api/request';
import {RequestInterface} from 'api/interfaces';
import {getSpaceAttribute, setSpaceAttributeItem} from 'api/repositories/spaceAttributeRepository';
import {AttributeNameEnum, PluginIdEnum} from 'api/enums';
import {
  GetSpaceAttributeRequest,
  GetSpaceAttributeResponse,
  SetSpaceAttributeItemRequest
} from 'api';

import {EventCreateRequest, FetchEventsRequest} from './eventsRepository.api.types';

export const setEventAttributes: RequestInterface<
  EventCreateRequest,
  GetSpaceAttributeResponse | null
> = (options) => {
  const {spaceId, eventId, data, ...restOptions} = options;

  const attributeOptions: SetSpaceAttributeItemRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    sub_attribute_key: eventId,
    value: data,
    ...restOptions
  };

  console.info(attributeOptions);

  return setSpaceAttributeItem(attributeOptions, request);
};

export const getEventAttributes: RequestInterface<
  FetchEventsRequest,
  GetSpaceAttributeResponse | null
> = (options) => {
  const {spaceId, ...restOptions} = options;

  const attributeOptions: GetSpaceAttributeRequest = {
    spaceId: spaceId,
    plugin_id: PluginIdEnum.CORE,
    attribute_name: AttributeNameEnum.EVENTS,
    ...restOptions
  };

  return getSpaceAttribute(attributeOptions, request);
};
