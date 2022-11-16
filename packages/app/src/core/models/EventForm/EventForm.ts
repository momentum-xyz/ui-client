import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';

import {EventItemModelInterface} from 'core/models';
import {api, CreateEventResponse, EventItemInterface, UploadImageResponse} from 'api';
import {EventFormInterface} from 'core/interfaces';

import {EventDataInterface} from '../EventItemModel/models/EventData';

const EventForm = types.compose(
  ResetModel,
  types
    .model('EventForm', {
      currentEvent: types.maybe(types.frozen<EventDataInterface>()),
      imageSrc: types.maybeNull(types.string),
      imageHash: types.maybe(types.string),
      eventFormRequest: types.optional(RequestModel, {}),
      uploadImageRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editEvent(event: EventItemModelInterface) {
        self.currentEvent = cast({...event.data});
        self.imageSrc = event.imageSrc;
      },
      createEventAttribute: flow(function* (
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

        const eventId = uuidv4();

        const event: EventItemInterface = {
          ...data,
          spaceId,
          spaceName,
          eventId,
          image: self.imageHash
        };

        yield self.eventFormRequest.send(api.eventsRepository.setEventAttributes, {
          spaceId,
          data: event,
          eventId
        });

        return self.eventFormRequest.isDone;
      }),
      createEvent: flow(function* (data: EventFormInterface, spaceId: string, file?: File) {
        const response: CreateEventResponse = yield self.eventFormRequest.send(
          api.old_eventsRepository.createEvent,
          {
            spaceId,
            data
          }
        );
        if (response && file) {
          const {id} = response;
          yield self.uploadImageRequest.send(api.old_eventsRepository.uploadImage, {
            spaceId,
            file,
            eventId: id
          });
        }

        return self.eventFormRequest.isDone;
      }),
      updateEvent: flow(function* (
        data: EventFormInterface,
        spaceId: string,
        eventId: string,
        file?: File
      ) {
        yield self.eventFormRequest.send(api.old_eventsRepository.updateEvent, {
          spaceId,
          eventId,
          data
        });
        if (file) {
          yield self.uploadImageRequest.send(api.old_eventsRepository.uploadImage, {
            spaceId,
            file,
            eventId
          });
        }

        return self.eventFormRequest.isDone;
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.eventFormRequest.isPending || self.uploadImageRequest.isPending;
      }
    }))
);

export {EventForm};
