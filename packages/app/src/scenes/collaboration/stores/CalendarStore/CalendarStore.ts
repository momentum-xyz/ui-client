import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';
import {v4 as uuidv4} from 'uuid';
import {generatePath} from 'react-router-dom';

import {AttendeeModel, EventForm, EventItemInterface, EventList} from 'core/models';
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
        key: 'current-position',
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
          self.key = uuidv4();

          const response = yield self.magicLinkRequest.send(api.magicLinkRepository.createLink, {
            key: self.key,
            data: {
              type: MagicTypeEnum.EVENT,
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
    get address(): string {
      return `${window.location.protocol}//${window.location.host}${generatePath(ROUTES.magic, {
        id: self.key
      })}`;
    }
  }));

export {CalendarStore};
