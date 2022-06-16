import {types} from 'mobx-state-tree';

import {UserStatusEnum} from 'core/enums';

const AttendeeModel = types.model('Attendee', {
  name: types.string,
  id: types.string,
  avatarHash: types.string,
  status: types.maybe(types.enumeration(Object.values(UserStatusEnum)))
});

export {AttendeeModel};
