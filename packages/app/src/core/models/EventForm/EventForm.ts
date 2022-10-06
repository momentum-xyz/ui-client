import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum/core';

import {EventItemDataInterface, EventItemInterface} from 'core/models';
import {api, CreateEventResponse, EventFormInterface} from 'api';

const EventForm = types.compose(
  ResetModel,
  types
    .model('EventForm', {
      currentEvent: types.maybe(types.frozen<EventItemDataInterface>()),
      imageSrc: types.maybeNull(types.string),
      eventFormRequest: types.optional(RequestModel, {}),
      uploadImageRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editEvent(event: EventItemInterface) {
        self.currentEvent = cast({...event.data});
        self.imageSrc = event.imageSrc;
      },
      createEvent: flow(function* (data: EventFormInterface, spaceId: string, file?: File) {
        const response: CreateEventResponse = yield self.eventFormRequest.send(
          api.eventsRepository.createEvent,
          {
            spaceId,
            data
          }
        );
        if (response && file) {
          const {id} = response;
          yield self.uploadImageRequest.send(api.eventsRepository.uploadImage, {
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
        yield self.eventFormRequest.send(api.eventsRepository.updateEvent, {
          spaceId,
          eventId,
          data
        });
        if (file) {
          yield self.uploadImageRequest.send(api.eventsRepository.uploadImage, {
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
        return self.eventFormRequest.isPending;
      }
    }))
);

export {EventForm};
