import {types, Instance} from 'mobx-state-tree';

import {formatEndDate, formatStartDate, formatStartTime, isOtherYearThanToday} from 'core/utils';

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
    get isLive(): boolean {
      const nowDate = new Date();
      return nowDate >= self.start && nowDate <= self.end;
    }
  }));

export interface EventItemModelInterface extends Instance<typeof EventItemModel> {}

export {EventItemModel};
