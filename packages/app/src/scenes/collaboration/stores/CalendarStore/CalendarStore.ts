import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';
import {generatePath} from 'react-router-dom';

import {AttendeeModel, EventForm, EventItemModelInterface, EventList} from 'core/models';
import {api} from 'api';
import {MagicTypeEnum} from 'core/enums';
import {ROUTES} from 'core/constants';

const CalendarStore = types
  .compose(
    ResetModel,
    types
      .model('CalendarStore', {
        formDialog: types.optional(Dialog, {}),
        magicDialog: types.optional(Dialog, {}),
        deleteConfirmationDialog: types.optional(Dialog, {}),
        eventList: types.optional(EventList, {}),
        eventForm: types.optional(EventForm, {}),
        magicLinkId: types.maybe(types.string),
        magicLinkRequest: types.optional(RequestModel, {}),
        removeEventRequest: types.optional(RequestModel, {}),
        eventIdToRemove: types.maybe(types.string),
        fullAttendeesListDialog: types.optional(Dialog, {}),
        attendeesList: types.optional(types.array(AttendeeModel), []),
        attendeesRequest: types.optional(RequestModel, {})
      })
      .actions((self) => ({
        editEvent(event: EventItemModelInterface) {
          self.eventForm.editEvent(event);
          self.formDialog.open();
        },
        selectEventToRemove(event: EventItemModelInterface) {
          self.eventIdToRemove = event.data?.eventId;
          self.deleteConfirmationDialog.open();
        },
        removeEvent: flow(function* (spaceId: string) {
          if (!self.eventIdToRemove) {
            return;
          }

          yield self.removeEventRequest.send(api.old_eventsRepository.deleteEvent, {
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
          self.magicLinkId = uuidv4();

          const response = yield self.magicLinkRequest.send(api.magicLinkRepository.createLink, {
            key: self.magicLinkId,
            type: MagicTypeEnum.EVENT,
            data: {
              eventId,
              spaceId
            }
          });

          if (response) {
            self.magicDialog.open();
          }
        }),
        hideFullAttendeesList() {
          self.fullAttendeesListDialog.close();
          self.attendeesList = cast([]);
        }
      }))
  )
  .views((self) => ({
    get magicLink(): string {
      if (!self.magicLinkId) {
        return '';
      }
      return `${window.location.origin}${generatePath(ROUTES.magic, {
        id: self.magicLinkId
      })}`;
    }
  }));

export {CalendarStore};
