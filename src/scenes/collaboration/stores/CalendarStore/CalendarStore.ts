import {flow, types} from 'mobx-state-tree';

import {DialogModel, EventItemModelInterface, RequestModel, ResetModel} from 'core/models';
import {api} from 'api';
import {MagicTypeEnum} from 'core/enums';

import {EventFormStore, EventListStore} from './models';

const CalendarStore = types.compose(
  ResetModel,
  types
    .model('CalendarStore', {
      formDialog: types.optional(DialogModel, {}),
      magicDialog: types.optional(DialogModel, {}),
      deleteConfirmationDialog: types.optional(DialogModel, {}),
      eventListStore: types.optional(EventListStore, {}),
      eventFormStore: types.optional(EventFormStore, {}),
      magicId: types.maybe(types.string),
      magicLinkRequest: types.optional(RequestModel, {}),
      removeEventRequest: types.optional(RequestModel, {}),
      eventIdToRemove: types.maybe(types.string)
    })
    .actions((self) => ({
      editEvent(event: EventItemModelInterface) {
        self.eventFormStore.editEvent(event);
        self.formDialog.open();
      },
      selectEventToRemove(eventId: string) {
        self.eventIdToRemove = eventId;
        self.deleteConfirmationDialog.open();
      },
      removeEvent: flow(function* (spaceId: string) {
        if (!self.eventIdToRemove) {
          return;
        }

        yield self.removeEventRequest.send(api.eventsRepository.deleteEvent, {
          spaceId,
          eventId: self.eventIdToRemove
        });

        if (self.removeEventRequest.isDone) {
          self.eventIdToRemove = undefined;
          self.deleteConfirmationDialog.close();
          self.eventListStore.fetchEvents(spaceId);
        }

        return self.removeEventRequest.isDone;
      }),
      showMagicLink: flow(function* (spaceId: string, eventId: string) {
        const response = yield self.magicLinkRequest.send(api.magicRepository.generateLink, {
          type: MagicTypeEnum.EVENT,
          data: {
            id: spaceId,
            eventId: eventId
          }
        });

        if (response) {
          self.magicId = response.id;
          self.magicDialog.open();
        }
      })
    }))
);

export {CalendarStore};
