import {types, Instance} from 'mobx-state-tree';

import {UserAttributeInterface} from 'api';

const EventItemData = types.model('EventItemData', {
  eventId: types.maybe(types.string),
  spaceId: types.maybe(types.string),
  spaceName: types.maybe(types.string),
  title: types.string,
  description: types.string,
  hosted_by: types.string,
  image: types.maybe(types.string),
  web_link: types.maybeNull(types.string),
  start: types.Date,
  end: types.Date,
  attendees: types.maybe(types.frozen<UserAttributeInterface>())
});

export type EventItemDataInterface = Instance<typeof EventItemData>;

export {EventItemData};
