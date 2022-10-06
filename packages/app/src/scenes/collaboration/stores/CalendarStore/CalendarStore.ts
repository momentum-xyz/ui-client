import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum/core';

import {AttendeeModel, EventForm, EventItemInterface, EventList} from 'core/models';
import {api} from 'api';
import {MagicTypeEnum} from 'core/enums';

const CalendarStore = types.compose(
  ResetModel,
  types
    .model('CalendarStore', {
      formDialog: types.optional(Dialog, {}),
      magicDialog: types.optional(Dialog, {}),
      deleteConfirmationDialog: types.optional(Dialog, {}),
      eventList: types.optional(EventList, {}),
      eventForm: types.optional(EventForm, {}),
      magicId: types.maybe(types.string),
      magicLinkRequest: types.optional(RequestModel, {}),
      removeEventRequest: types.optional(RequestModel, {}),
      eventIdToRemove: types.maybe(types.string),
      fullAttendeesListDialog: types.optional(Dialog, {}),
      attendeesList: types.optional(types.array(AttendeeModel), []),
      attendeesRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      editEvent(event: EventItemInterface) {
        self.eventForm.editEvent(event);
        self.formDialog.open();
      },
      selectEventToRemove(event: EventItemInterface) {
        self.eventIdToRemove = event.data?.id;
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
          self.eventList.fetchEvents(spaceId);
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
      }),
      hideFullAttendeesList() {
        self.fullAttendeesListDialog.close();
        self.attendeesList = cast([]);
      }
    }))
);

export {CalendarStore};
