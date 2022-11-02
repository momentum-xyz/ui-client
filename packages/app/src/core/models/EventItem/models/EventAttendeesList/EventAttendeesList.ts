import {types, flow, cast, Instance} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {
  AttendeeModel,
  AttendeeModelInterface,
  UserProfileModelInterface,
  UserSpaceDetails
} from 'core/models';
import {api, UserSpaceListItemResponse, AttendeesResponseInterface} from 'api';

const EventAttendeesList = types
  .compose(
    ResetModel,
    types.model('EventAttendeesList', {
      dialog: types.optional(Dialog, {}),
      query: types.optional(types.string, ''),
      attendees: types.optional(types.array(AttendeeModel), []),
      numberOfAttendees: types.optional(types.number, 0),
      request: types.optional(RequestModel, {}),
      spaceId: types.maybe(types.string),
      eventId: types.maybe(types.string),
      eventName: types.maybe(types.string),
      selectedAttendeeId: types.maybe(types.string),
      attendeeDialog: types.optional(Dialog, {}),
      userSpaceList: types.optional(types.array(UserSpaceDetails), []),
      spaceListRequest: types.optional(RequestModel, {})
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
    fetchUserSpaceList: flow(function* () {
      if (self.selectedAttendeeId) {
        const response: UserSpaceListItemResponse[] = yield self.spaceListRequest.send(
          api.spaceRepository.fetchUserSpaceList,
          {userId: self.selectedAttendeeId}
        );

        if (response) {
          self.userSpaceList = cast(response);
        }
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
    selectAttendee: flow(function* (attendee: AttendeeModelInterface) {
      self.selectedAttendeeId = attendee.id;
      self.userSpaceList = cast([]);
      self.attendeeDialog.open();
      yield self.fetchUserSpaceList();
    }),
    hideAttendee() {
      self.selectedAttendeeId = undefined;
      self.userSpaceList = cast([]);
      self.attendeeDialog.close();
    }
  }))
  .views((self) => ({
    get selectedAttendee(): UserProfileModelInterface | undefined {
      return self.selectedAttendeeId
        ? self.attendees.find((attendee) => attendee.user.uuid === self.selectedAttendeeId)?.user
        : undefined;
    }
  }));

export type EventAttendeesListModelType = Instance<typeof EventAttendeesList>;

export {EventAttendeesList};
