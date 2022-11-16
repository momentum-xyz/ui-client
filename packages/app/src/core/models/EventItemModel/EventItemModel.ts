import {types, Instance} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';
import {
  durationInHours,
  formatEndDate,
  formatStartDate,
  formatStartTime,
  formattedStringFromDate,
  isOtherYearThanToday
} from '@momentum-xyz/core';

import {appVariables} from 'api/constants';

import {EventData} from './models/EventData';

const EventItemModel = types
  .model('EventItemModel', {
    data: types.maybe(EventData)
  })
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
    }
  }));
export interface EventItemModelInterface extends Instance<typeof EventItemModel> {}

export {EventItemModel};
