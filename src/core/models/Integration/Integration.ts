import {types} from 'mobx-state-tree';

import {IntegrationTypeEnum, ModerationEnum, StageModeRequestEnum} from 'core/enums';

import {IntegrationData, IntegrationUser} from './models';

const Integration = types.model('Integration', {
  spaceId: types.string,
  integrationType: types.enumeration(Object.values(IntegrationTypeEnum)),
  stageModeRequestType: types.maybeNull(types.enumeration(Object.values(StageModeRequestEnum))),
  modType: types.maybeNull(types.enumeration(Object.values(ModerationEnum))),
  spaceIntegrationUsers: types.maybe(types.array(IntegrationUser)),
  data: types.maybeNull(IntegrationData)
});

export {Integration};
