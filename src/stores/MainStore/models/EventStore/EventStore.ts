import {types, Instance, flow, cast} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';

import {api, MagicLinkResponse} from 'api';
import {EventItemModel, RequestModel, ResetModel} from 'core/models';
import {AttendeeModel} from 'core/models/AttendeeModel';
import {AttendeesResponseInterface} from 'api/repositories/attendeesRepository/attendeesRepository.api.types';
import {durationInHours, formattedStringFromDate} from 'core/utils';

const EventStore = types
  .compose(
    ResetModel,
    types.model('EventStore', {
      event: EventItemModel,
      magicLink: types.maybe(types.string),
      magicRequest: types.optional(RequestModel, {}),
      fetchAttendeesRequest: types.optional(RequestModel, {}),
      attendees: types.optional(types.array(AttendeeModel), []),
      numberOfAllAttendees: types.optional(types.number, 0),
      attendRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchAttendees: flow(function* (limit?: boolean) {
      const response: AttendeesResponseInterface = yield self.fetchAttendeesRequest.send(
        api.attendeesRepository.fetchAttendees,
        {eventId: self.event.id, spaceId: self.event.spaceId, limit}
      );

      if (response) {
        self.attendees = cast(response.attendees);
        self.numberOfAllAttendees = response.count;
      }
    }),
    fetchMagicLink: flow(function* () {
      const response: MagicLinkResponse = yield self.magicRequest.send(
        api.magicRepository.generateLink,
        {
          type: 'event',
          data: {
            id: self.event.spaceId,
            eventId: self.event.id
          }
        }
      );

      if (response) {
        self.magicLink = `${window.location.origin}/magic/${response.id}`;
      }
    })
  }))
  .actions((self) => ({
    init() {
      self.fetchMagicLink();
      self.fetchAttendees(true);
    },
    attend: flow(function* () {
      yield self.attendRequest.send(api.attendeesRepository.addAttendee, {
        eventId: self.event.id,
        spaceId: self.event.spaceId
      });

      self.fetchAttendees(true);
    }),
    stopAttending: flow(function* () {
      yield self.attendRequest.send(api.attendeesRepository.removeAttendee, {
        eventId: self.event.id,
        spaceId: self.event.spaceId
      });

      self.fetchAttendees(true);
    }),
    isAttending(userId: string) {
      return self.attendees.some((attendee) => attendee.id === userId);
    }
  }))
  .views((self) => ({
    get asCalendarEvent(): EventCalendarInterface | undefined {
      return {
        description: self.event.description,
        duration: durationInHours(self.event.start, self.event.end),
        endDatetime: formattedStringFromDate(self.event.end),
        startDatetime: formattedStringFromDate(self.event.start),
        title: self.event.title,
        location: self.magicLink
      };
    }
  }));

export interface EventStoreInterface extends Instance<typeof EventStore> {}

export {EventStore};
