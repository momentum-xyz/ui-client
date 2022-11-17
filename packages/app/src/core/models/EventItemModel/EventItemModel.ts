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
import {UserModelInterface} from 'core/models';

import {EventData, EventDataInterface} from './models/EventData';

const EventItemModel = types
  .model('EventItemModel', {
    data: types.maybe(EventData),
    attendees: types.array(types.frozen<UserModelInterface>()),
    attendeesRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    attending: flow(function* (
      spaceId: string,
      user: UserModelInterface,
      data?: EventDataInterface
    ) {
      const event: EventItemInterface = {
        ...data,
        attendees: {
          ...data?.attendees,
          [user.id]: user
        }
      };

      const response = yield self.attendeesRequest.send(api.eventsRepository.setEventAttributes, {
        spaceId,
        data: event,
        eventId: data?.eventId ?? ''
      });

      if (response) {
        const event = mapper.mapSubAttributeValue<EventDataInterface>(response);
        if (event?.attendees) {
          self.attendees = cast(Object.values(event?.attendees));
        }
      }

      return self.attendeesRequest.isDone;
    }),
    withdrawAttending: flow(function* (spaceId: string, userId: string, data?: EventDataInterface) {
      const attendees: UserAttributeInterface = {
        ...data?.attendees
      };

      delete attendees?.[userId];

      const event: EventItemInterface = {
        ...data,
        attendees: {
          ...attendees
        }
      };

      const response = yield self.attendeesRequest.send(api.eventsRepository.setEventAttributes, {
        spaceId,
        data: event,
        eventId: data?.eventId ?? ''
      });

      if (response) {
        const event = mapper.mapSubAttributeValue<EventDataInterface>(response);
        if (event?.attendees) {
          self.attendees = cast(Object.values(event?.attendees));
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
        title: self.data?.title,
        location: 'self.magicLink'
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
      return formatEndDate(new Date(self.data?.end ?? new Date()), true);
    },
    get imageSrc(): string {
      return `${appVariables.RENDER_SERVICE_URL}/get/${self.data?.image}`;
    },
    isAttending(userId: string) {
      return self.attendees.some((attendee) => attendee.id === userId);
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
