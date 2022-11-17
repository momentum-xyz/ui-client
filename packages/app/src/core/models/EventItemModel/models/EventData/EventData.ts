import {types, Instance} from 'mobx-state-tree';

import {UserAttributeInterface} from 'api';

const EventData = types.model('EventData', {
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

export type EventDataInterface = Instance<typeof EventData>;

export {EventData};
