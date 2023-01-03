import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {EventForm, EventItemInterface, EventList} from 'core/models';
import {api} from 'api';

const CalendarStore = types.compose(
  ResetModel,
  types
    .model('CalendarStore', {
      dialog: types.optional(Dialog, {}),
      formDialog: types.optional(Dialog, {}),
      eventForm: types.optional(EventForm, {}),

      deleteConfirmationDialog: types.optional(Dialog, {}),
      removeEventRequest: types.optional(RequestModel, {}),
      eventIdToRemove: types.maybe(types.string),

      eventList: types.optional(EventList, {})
    })
    .actions((self) => ({
      editEvent: flow(function* (event: EventItemInterface) {
        yield self.eventForm.editEvent(event);
        self.formDialog.open();
      }),
      selectEventToRemove(event: EventItemInterface) {
        self.eventIdToRemove = event.data?.eventId;
        self.deleteConfirmationDialog.open();
      },
      removeEvent: flow(function* (spaceId: string) {
        if (!self.eventIdToRemove) {
          return false;
        }

        yield self.removeEventRequest.send(api.eventsRepository.deleteEventAttribute, {
          spaceId,
          eventId: self.eventIdToRemove
        });

        if (self.removeEventRequest.isDone) {
          self.eventIdToRemove = undefined;
          self.deleteConfirmationDialog.close();
          self.eventList.fetchSpaceEvents(spaceId);
        }

        return self.removeEventRequest.isDone;
      })
    }))
);

export {CalendarStore};
