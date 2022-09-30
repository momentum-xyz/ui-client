import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum/core';

import {DialogModel, EventForm, EventItemInterface, EventList} from 'core/models';
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
      eventList: types.optional(EventList, {}),
      spaceId: types.maybe(types.string),
      eventForm: types.optional(EventForm, {}),
      magicId: types.maybe(types.string),
      magicLinkRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editEvent(event: EventItemInterface) {
        self.eventForm.editEvent(event);
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
          self.eventList.fetchEvents(worldId, true);
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
