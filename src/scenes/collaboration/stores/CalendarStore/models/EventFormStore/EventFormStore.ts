import {flow, types} from 'mobx-state-tree';

import {EventItemModel, EventItemModelInterface, RequestModel, ResetModel} from 'core/models';
import {api, CreateEventResponse, EventFormInterface} from 'api';

const EventFormStore = types.compose(
  ResetModel,
  types
    .model('EventFormStore', {
      currentEvent: types.maybeNull(EventItemModel),
      eventFormRequest: types.optional(RequestModel, {}),
      uploadImageRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editEvent(event: EventItemModelInterface) {
        self.currentEvent = {
          ...event
        };
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

export {EventFormStore};
