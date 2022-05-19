import {types, Instance} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';
import {format} from 'date-fns';

import {durationInHours, formattedStringFromDate} from 'core/utils';

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
    end: types.Date
  })
  .actions((self) => ({
    isLive(): boolean {
      const nowDate = new Date();
      return nowDate >= self.start && nowDate <= self.end;
    }
  }))
  .views((self) => ({
    get toBytes() {
      return Buffer.from(self.id.replace(/-/g, ''), 'hex');
    },
    get startDateAndTime() {
      return format(new Date(self.start), 'EEE, MMM M - h:mm aa').toUpperCase();
    },
    get endDateAndTime() {
      return format(new Date(self.end), 'MMM M h:mm aa').toUpperCase();
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
        title: self.title
      };
    }
  }));

export interface EventItemModelInterface extends Instance<typeof EventItemModel> {}

export {EventItemModel};
