import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';

import {EventItemInterface, EventItemDataInterface} from 'core/models';
import {api, EventInterface, UploadImageResponse} from 'api';
import {EventFormInterface} from 'core/interfaces';
import {mapper} from 'api/mapper';
import {appVariables} from 'api/constants';

const EventForm = types.compose(
  ResetModel,
  types
    .model('EventForm', {
      currentEvent: types.maybe(types.frozen<EventItemDataInterface>()),
      imageHash: types.maybe(types.string),
      eventId: types.maybe(types.string),
      eventFormRequest: types.optional(RequestModel, {}),
      fetchEventRequest: types.optional(RequestModel, {}),
      uploadImageRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editEvent: flow(function* (event: EventItemInterface) {
        const eventResponse = yield self.fetchEventRequest.send(
          api.eventsRepository.getEventAttribute,
          {
            eventId: event?.data?.eventId ?? '',
            spaceId: event?.data?.spaceId ?? ''
          }
        );
        const eventMapped = mapper.mapSubAttributeValue<EventItemDataInterface>(eventResponse);

        if (eventMapped) {
          self.currentEvent = cast({
            ...eventMapped,
            start: new Date(eventMapped.start),
            end: new Date(eventMapped.end),
            attendees: eventMapped.attendees
          });
        }
      }),
      createOrUpdateEvent: flow(function* (
        data: EventFormInterface,
        spaceId: string,
        spaceName?: string,
        file?: File
      ) {
        if (file) {
          const uploadImageResponse: UploadImageResponse = yield self.uploadImageRequest.send(
            api.mediaRepository.uploadImage,
            {file}
          );

          if (!uploadImageResponse) {
            console.log('Failed to upload event image');
            return false;
          }

          self.imageHash = uploadImageResponse.hash;
        }

        let event: EventInterface = {};

        if (self.currentEvent) {
          event = {
            ...data,
            attendees: self.currentEvent?.attendees,
            spaceId,
            eventId: self.currentEvent?.eventId,
            image: file ? self.imageHash : self.currentEvent.image
          };
        } else {
          self.eventId = uuidv4();

          event = {
            ...data,
            spaceId,
            spaceName,
            eventId: self.eventId,
            image: self.imageHash
          };
        }

        yield self.eventFormRequest.send(api.eventsRepository.setEventAttributes, {
          spaceId,
          data: event,
          eventId: self.currentEvent ? self.currentEvent.eventId : self.eventId ?? ''
        });

        return self.eventFormRequest.isDone;
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.eventFormRequest.isPending || self.uploadImageRequest.isPending;
      },
      get imageSrc(): string {
        return `${appVariables.RENDER_SERVICE_URL}/get/${self.currentEvent?.image}`;
      }
    }))
);

export {EventForm};
