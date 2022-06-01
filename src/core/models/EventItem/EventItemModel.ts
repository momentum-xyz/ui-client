import {types, Instance, flow} from 'mobx-state-tree';
import {EventCalendarInterface} from 'react-add-to-calendar-hoc';

import {
  durationInHours,
  formatEndDate,
  formatStartDate,
  formatStartTime,
  formattedStringFromDate
} from 'core/utils';
import {api, MagicLinkResponse} from 'api';

import {RequestModel} from '../Request';

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
    magicRequest: types.optional(RequestModel, {})
  })
  .actions((self) => ({
    isLive(): boolean {
      const nowDate = new Date();
      return nowDate >= self.start && nowDate <= self.end;
    },
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
  .views((self) => ({
    get toBytes() {
      return Buffer.from(self.id.replace(/-/g, ''), 'hex');
    },
    get startDate() {
      return formatStartDate(new Date(self.start));
    },
    get startTime() {
      return formatStartTime(new Date(self.start));
    },
    get endDateAndTime() {
      return formatEndDate(new Date(self.end));
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
    }
  }));

export interface EventItemModelInterface extends Instance<typeof EventItemModel> {}

export {EventItemModel};
