import {types, flow, cast, Instance} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {AttendeeModel, AttendeeModelInterface} from 'core/models';
import {AttendeesResponseInterface} from 'api/repositories/attendeesRepository/attendeesRepository.api.types';
import {api} from 'api';

const EventAttendees = types
  .compose(
    ResetModel,
    types.model('EventAttendees', {
      dialog: types.optional(Dialog, {}),
      query: types.optional(types.string, ''),
      attendees: types.optional(types.array(AttendeeModel), []),
      numberOfAttendees: types.optional(types.number, 0),
      request: types.optional(RequestModel, {}),
      spaceId: types.maybe(types.string),
      eventId: types.maybe(types.string),
      eventName: types.maybe(types.string),
      selectedAttendeeId: types.maybe(types.string),
      attendeeDialog: types.optional(Dialog, {})
    })
  )
  .actions((self) => ({
    fetchAttendees: flow(function* () {
      if (!self.spaceId || !self.eventId) {
        return;
      }

      const response: AttendeesResponseInterface = yield self.request.send(
        api.attendeesRepository.fetchAttendees,
        {query: self.query, eventId: self.eventId, spaceId: self.spaceId}
      );

      if (response) {
        self.attendees = cast(response.attendees);
        self.numberOfAttendees = response.count;
      }
    }),
    changeQuery(query: string) {
      self.query = query;
    }
  }))
  .actions((self) => ({
    showAttendees: flow(function* (eventName: string, eventId: string, spaceId: string) {
      self.eventName = eventName;
      self.eventId = eventId;
      self.spaceId = spaceId;
      self.dialog.open();
      yield self.fetchAttendees();
    }),
    selectAttendee(attendee: AttendeeModelInterface) {
      self.selectedAttendeeId = attendee.id;
      self.attendeeDialog.open();
    },
    hideAttendee() {
      self.selectedAttendeeId = undefined;
      self.attendeeDialog.close();
    }
  }));

export type EventAttendeesModelType = Instance<typeof EventAttendees>;

export {EventAttendees};
