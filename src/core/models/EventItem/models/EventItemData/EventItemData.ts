import {types, Instance} from 'mobx-state-tree';

const EventItemData = types.model('EventItemData', {
  id: types.string,
  title: types.string,
  description: types.string,
  hosted_by: types.string,
  image_hash: types.maybeNull(types.string),
  web_link: types.maybeNull(types.string),
  is_admin: types.maybe(types.boolean),
  spaceName: types.string,
  spaceId: types.string,
  start: types.Date,
  end: types.Date
});
export interface EventItemDataInterface extends Instance<typeof EventItemData> {}

export {EventItemData};
