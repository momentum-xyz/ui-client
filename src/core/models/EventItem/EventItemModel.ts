import {types, Instance} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';

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
      return self.start
        .toLocaleString('default', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        .toUpperCase();
    },
    get endDateAndTime() {
      return self.end
        .toLocaleString('default', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
        .toUpperCase();
    },
    get timeZone() {
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
