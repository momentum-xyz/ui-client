import {types} from 'mobx-state-tree';

import {StageModeUserRoleEnum} from 'core/enums';

const IntegrationUserData = types.model('IntegrationUserData', {
  role: types.maybe(types.enumeration(Object.values(StageModeUserRoleEnum)))
});

export {IntegrationUserData};
