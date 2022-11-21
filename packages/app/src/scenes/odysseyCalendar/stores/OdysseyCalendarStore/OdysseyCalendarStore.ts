import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {EventForm, EventItemModelInterface, EventList} from 'core/models';
import {api} from 'api';

const OdysseyCalendarStore = types.compose(
  ResetModel,
  types
    .model('OdysseyCalendarStore', {
      formDialog: types.optional(Dialog, {}),
      deleteConfirmationDialog: types.optional(Dialog, {}),
      removeEventRequest: types.optional(RequestModel, {}),
      eventIdToRemove: types.maybe(types.string),
      weblinkDialog: types.optional(Dialog, {}),
      eventList: types.optional(EventList, {}),
      eventForm: types.optional(EventForm, {})
    })
    .actions((self) => ({
      editEvent(event: EventItemModelInterface) {
        self.eventForm.editEvent(event);
        self.formDialog.open();
      },
      selectEventToRemove(event: EventItemModelInterface) {
        console.info(event);
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

export {OdysseyCalendarStore};
