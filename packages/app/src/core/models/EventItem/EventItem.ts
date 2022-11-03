import {types, Instance, flow, cast} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';
import {
  RequestModel,
  durationInHours,
  formatEndDate,
  formatStartDate,
  formatStartTime,
  formattedStringFromDate,
  isOtherYearThanToday
} from '@momentum-xyz/core';
import {generatePath} from 'react-router-dom';

import {api, AttendeesResponseInterface} from 'api';
import {AttendeeModel} from 'core/models/AttendeeModel';
import {appVariables} from 'api/constants';
import {ROUTES} from 'core/constants';

import {EventItemData, EventAttendeesList} from './models';

const EventItem = types
  .model('EventItem', {
    data: types.maybe(EventItemData),
    magicRequest: types.optional(RequestModel, {}),
    fetchAttendeesRequest: types.optional(RequestModel, {}),
    attendees: types.optional(types.array(AttendeeModel), []),
    attendeesDetails: types.optional(EventAttendeesList, {}),
    numberOfAllAttendees: types.optional(types.number, 0),
    attendRequest: types.optional(RequestModel, {}),
    key: ''
  })
  .actions((self) => ({
    fetchAttendees: flow(function* (limit?: boolean) {
      if (!self.data) {
        return;
      }

      const response: AttendeesResponseInterface = yield self.fetchAttendeesRequest.send(
        api.attendeesRepository.fetchAttendees,
        {eventId: self.data?.id, spaceId: self.data?.spaceId, limit}
      );

      if (response) {
        self.attendees = cast(response.attendees);
        self.numberOfAllAttendees = response.count;
      }
    })
  }))
  .actions((self) => ({
    init() {
      self.fetchAttendees(true);
    },
    isLive(): boolean {
      const nowDate = new Date();
      if (self.data) {
        return nowDate >= self.data.start && nowDate <= self.data.end;
      }
      return false;
    },
    attend: flow(function* () {
      if (!self.data) {
        return;
      }

      yield self.attendRequest.send(api.attendeesRepository.addAttendee, {
        eventId: self.data?.id,
        spaceId: self.data?.spaceId
      });

      self.fetchAttendees(true);
    }),
    stopAttending: flow(function* () {
      if (!self.data) {
        return;
      }

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
    get asCalendarEvent(): EventCalendarInterface | null {
      if (!self.data) {
        return null;
      }
      return {
        description: self.data.description,
        duration: durationInHours(self.data.start, self.data.end),
        endDatetime: formattedStringFromDate(self.data.end),
        startDatetime: formattedStringFromDate(self.data.start),
        title: self.data?.title,
        location: this.magicLink
      };
    },
    get imageSrc(): string {
      return `${appVariables.RENDER_SERVICE_URL}/get/${self.data?.image_hash}`;
    },
    isAttending(userId: string) {
      return self.attendees.some((attendee) => attendee.id === userId);
    },
    get magicLink(): string {
      return `${document.location.origin}${generatePath(ROUTES.magic, {id: self.key})}`;
    }
  }));

export interface EventItemInterface extends Instance<typeof EventItem> {}

export {EventItem};
