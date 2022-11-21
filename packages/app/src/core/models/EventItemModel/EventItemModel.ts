import {types, Instance, flow, cast} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';
import {
  durationInHours,
  formatEndDate,
  formatStartDate,
  formatStartTime,
  formattedStringFromDate,
  isOtherYearThanToday,
  RequestModel
} from '@momentum-xyz/core';
import {ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {mapper} from 'api/mapper';
import {appVariables} from 'api/constants';
import {api, EventItemInterface, UserAttributeInterface} from 'api';
import {AttendeesList, UserModelInterface} from 'core/models';

import {EventData, EventDataInterface} from './models/EventData';

const EventItemModel = types
  .model('EventItemModel', {
    data: types.maybe(EventData),
    attendeesList: types.optional(AttendeesList, {}),
    attendeesRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    attending: flow(function* (spaceId: string, eventId: string, user: UserModelInterface) {
      const eventResponse = yield self.attendeesRequest.send(
        api.eventsRepository.getEventAttribute,
        {
          spaceId,
          eventId
        }
      );

      const eventMapped = mapper.mapSubAttributeValue<EventDataInterface>(eventResponse);

      const event: EventItemInterface = {
        ...eventMapped,
        attendees: {
          ...eventMapped?.attendees,
          [user.id]: user
        }
      };

      const response = yield self.attendeesRequest.send(api.eventsRepository.setEventAttributes, {
        spaceId,
        data: event,
        eventId
      });

      if (response) {
        const event = mapper.mapSubAttributeValue<EventDataInterface>(response);
        if (event?.attendees) {
          self.attendeesList = cast({
            attendees: Object.values(event?.attendees)
          });
        }
      }

      return self.attendeesRequest.isDone;
    }),
    withdrawAttending: flow(function* (spaceId: string, eventId: string, userId: string) {
      const eventResponse = yield self.attendeesRequest.send(
        api.eventsRepository.getEventAttribute,
        {
          spaceId,
          eventId
        }
      );

      const eventMapped = mapper.mapSubAttributeValue<EventDataInterface>(eventResponse);

      const attendees: UserAttributeInterface = {
        ...eventMapped?.attendees
      };

      delete attendees?.[userId];

      const event: EventItemInterface = {
        ...mapper.mapSubAttributeValue<EventDataInterface>(eventResponse),
        attendees: {
          ...attendees
        }
      };

      const response = yield self.attendeesRequest.send(api.eventsRepository.setEventAttributes, {
        spaceId,
        data: event,
        eventId
      });

      if (response) {
        const event = mapper.mapSubAttributeValue<EventDataInterface>(response);
        if (event?.attendees) {
          self.attendeesList = cast({
            attendees: Object.values(event?.attendees)
          });
        }
      }

      return self.attendeesRequest.isDone;
    })
  }))
  .views((self) => ({
    get isLive(): boolean {
      if (self.data) {
        const nowDate = new Date();
        if (self.data.start && self.data.end) {
          return nowDate >= self.data.start && nowDate <= self.data.end;
        }
      }
      return false;
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
        title: self.data?.title
      };
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
      if (self.data) {
        const showYear =
          isOtherYearThanToday(self.data?.start) || isOtherYearThanToday(self.data?.end);
        return formatEndDate(new Date(self.data?.end), showYear);
      }
      return;
    },
    get imageSrc(): string {
      return `${appVariables.RENDER_SERVICE_URL}/get/${self.data?.image}`;
    },
    isAttending(userId: string) {
      return self.attendeesList.attendees.some((attendee) => attendee.id === userId);
    },
    avatarSrc(avatar_hash: string): string | undefined {
      return `${appVariables.RENDER_SERVICE_URL}/texture/${ImageSizeEnum.S3}/${avatar_hash}`;
    },
    get isLoading(): boolean {
      return self.attendeesRequest.isPending;
    }
  }));
export interface EventItemModelInterface extends Instance<typeof EventItemModel> {}

export {EventItemModel};
