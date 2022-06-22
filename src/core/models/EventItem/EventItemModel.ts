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
import {api, MagicLinkResponse} from 'api';
import {RequestModel} from 'core/models';
import {AttendeeModel} from 'core/models/AttendeeModel';
import {AttendeesResponseInterface} from 'api/repositories/attendeesRepository/attendeesRepository.api.types';

// TODO: - Wait for BE changes to include attendees and magicLink inside each event, and then remove requests.
const EventItemModel = types
  .model('EventItem', {
    id: types.string,
    title: types.string,
    description: types.string,
    hosted_by: types.string,
    image_hash: types.maybeNull(types.string),
    web_link: types.maybeNull(types.string),
    spaceName: types.maybeNull(types.string),
    spaceId: types.maybeNull(types.string),
    start: types.Date,
    end: types.Date,
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
        {eventId: self.id, spaceId: self.spaceId, limit}
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
            id: self.spaceId,
            eventId: self.id
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
      return nowDate >= self.start && nowDate <= self.end;
    },
    attend: flow(function* () {
      yield self.attendRequest.send(api.attendeesRepository.addAttendee, {
        eventId: self.id,
        spaceId: self.spaceId
      });

      self.fetchAttendees(true);
    }),
    stopAttending: flow(function* () {
      yield self.attendRequest.send(api.attendeesRepository.removeAttendee, {
        eventId: self.id,
        spaceId: self.spaceId
      });

      self.fetchAttendees(true);
    })
  }))
  .views((self) => ({
    get toBytes() {
      return Buffer.from(self.id.replace(/-/g, ''), 'hex');
    },
    get startDate() {
      const showYear = isOtherYearThanToday(self.start) || isOtherYearThanToday(self.end);

      return formatStartDate(new Date(self.start), showYear);
    },
    get startTime() {
      return formatStartTime(new Date(self.start));
    },
    get endDateAndTime() {
      return formatEndDate(new Date(self.end), true);
    },
    get timeZone() {
      // @ts-ignore
      return self.start.toLocaleDateString('en-US', {timeZoneName: 'short'}).split(' ').at(-1);
    },
    get asCalendarEvent(): EventCalendarInterface {
      return {
        description: self.description,
        duration: durationInHours(self.start, self.end),
        endDatetime: formattedStringFromDate(self.end),
        startDatetime: formattedStringFromDate(self.start),
        title: self.title,
        location: self.magicLink
      };
    },
    isAttending(userId: string) {
      return self.attendees.some((attendee) => attendee.id === userId);
    }
  }));

export interface EventItemModelInterface extends Instance<typeof EventItemModel> {}

export {EventItemModel};
