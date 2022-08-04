import {types} from 'mobx-state-tree';

import {ResetModel, UUIDModel} from 'core/models';
import {ModerationEnum, StageModeRequestEnum} from 'core/enums';

import {IntegrationData, IntegrationUser} from './models';

const Integration = types.compose(
  ResetModel,
  types.model('Integration', {
    spaceId: UUIDModel,
    integrationTypeId: UUIDModel,
    stageModeRequestType: types.maybeNull(types.enumeration(Object.values(StageModeRequestEnum))),
    modType: types.maybeNull(types.enumeration(Object.values(ModerationEnum))),
    spaceIntegrationUsers: types.maybe(types.array(IntegrationUser)),
    data: types.maybeNull(IntegrationData)
  })
);

export {Integration};
