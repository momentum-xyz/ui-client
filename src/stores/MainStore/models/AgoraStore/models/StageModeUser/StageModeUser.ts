import {Instance, types} from 'mobx-state-tree';

import {ParticipantRole} from 'core/enums';

const StageModeUser = types.model('StageModeUser', {
  uid: types.string,
  role: types.enumeration(Object.values(ParticipantRole))
});

export interface StageModeUserInterface extends Instance<typeof StageModeUser> {}

export {StageModeUser};
