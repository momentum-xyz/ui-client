import {types, Instance, flow, cast} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';

import {
  durationInHours,
  formatEndDate,
  formatStartDate,
  formatStartTime,
  formattedStringFromDate,
  isOtherYearThanToday
} from 'core/utils';
import {api, MagicLinkResponse, AttendeesResponseInterface} from 'api';
import {RequestModel} from 'core/models';
import {AttendeeModel} from 'core/models/AttendeeModel';

import {EventItemData} from './models';

const EventItem = types
  .model('EventItem', {
    data: types.maybe(EventItemData),
    magicLink: types.maybe(types.string),
    magicRequest: types.optional(RequestModel, {}),
    fetchAttendeesRequest: types.optional(RequestModel, {}),
    attendees: types.optional(types.array(AttendeeModel), []),
    numberOfAllAttendees: types.optional(types.number, 0),
    attendRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    fetchAttendees: flow(function* (limit?: boolean) {
      const response: AttendeesResponseInterface = yield self.fetchAttendeesRequest.send(
        api.attendeesRepository.fetchAttendees,
        {eventId: self.data?.id, spaceId: self.data?.spaceId, limit}
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
            id: self.data?.spaceId,
            eventId: self.data?.id
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
    isLive(): boolean {
      const nowDate = new Date();
      if (self.data) {
        return nowDate >= self.data?.start && nowDate <= self.data?.end;
      }
      return false;
    },
    attend: flow(function* () {
      yield self.attendRequest.send(api.attendeesRepository.addAttendee, {
        eventId: self.data?.id,
        spaceId: self.data?.spaceId
      });

      self.fetchAttendees(true);
    }),
    stopAttending: flow(function* () {
      yield self.attendRequest.send(api.attendeesRepository.removeAttendee, {
        eventId: self.data?.id,
        spaceId: self.data?.spaceId
      });

      self.fetchAttendees(true);
    })
  }))
  .views((self) => ({
    get toBytes() {
      return Buffer.from(self.data?.id?.replace(/-/g, '') ?? '', 'hex');
    },
    get startDate() {
      if (self.data) {
        const showYear =
          isOtherYearThanToday(self.data?.start) || isOtherYearThanToday(self.data?.end);

        return formatStartDate(new Date(self.data?.start), showYear);
      }
      return;
    },
    get startTime() {
      return formatStartTime(new Date(self.data?.start ?? new Date()));
    },
    get endDateAndTime() {
      return formatEndDate(new Date(self.data?.end ?? new Date()), true);
    },
    get asCalendarEvent(): EventCalendarInterface {
      return {
        description: self.data?.description ?? '',
        duration: durationInHours(self.data?.start ?? new Date(), self.data?.end ?? new Date()),
        endDatetime: formattedStringFromDate(self.data?.end ?? new Date()),
        startDatetime: formattedStringFromDate(self.data?.start ?? new Date()),
        title: self.data?.title ?? '',
        location: self.magicLink
      };
    },
    isAttending(userId: string) {
      return self.attendees.some((attendee) => attendee.id === userId);
    }
  }));

export interface EventItemInterface extends Instance<typeof EventItem> {}

export {EventItem};
