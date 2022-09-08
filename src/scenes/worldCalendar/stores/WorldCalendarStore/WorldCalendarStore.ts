import {flow, types} from 'mobx-state-tree';

import {
  DialogModel,
  EventForm,
  EventItemInterface,
  EventList,
  RequestModel,
  ResetModel
} from 'core/models';
import {api} from 'api';
import {MagicTypeEnum} from 'core/enums';

const WorldCalendarStore = types.compose(
  ResetModel,
  types
    .model('WorldCalendarStore', {
      formDialog: types.optional(DialogModel, {}),
      deleteConfirmationDialog: types.optional(DialogModel, {}),
      removeEventRequest: types.optional(RequestModel, {}),
      eventIdToRemove: types.maybe(types.string),
      weblinkDialog: types.optional(DialogModel, {}),
      magicDialog: types.optional(DialogModel, {}),
      eventListStore: types.optional(EventList, {}),
      spaceId: types.maybe(types.string),
      eventFormStore: types.optional(EventForm, {}),
      magicId: types.maybe(types.string),
      magicLinkRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editEvent(event: EventItemInterface) {
        self.eventFormStore.editEvent(event);
        self.formDialog.open();
      },
      selectEventToRemove(event: EventItemInterface) {
        self.eventIdToRemove = event.data?.id;
        self.spaceId = event.data?.spaceId;
        self.deleteConfirmationDialog.open();
      },
      removeEvent: flow(function* (spaceId: string, worldId: string) {
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
          self.eventListStore.fetchEvents(worldId, true);
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

export {WorldCalendarStore};
