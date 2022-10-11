import {types} from 'mobx-state-tree';
import {UUIDModel, ResetModel} from '@momentum/core';

import {ModerationEnum, StageModeRequestEnum} from 'core/enums';

import {IntegrationData, IntegrationUser} from './models';

// TODO: Remove when all plugins will be extracted and move to each plugin
const Integration = types.compose(
  ResetModel,
  types.model('Integration', {
    spaceId: UUIDModel,
    integrationTypeId: UUIDModel,
    stageModeRequestType: types.maybe(types.enumeration(Object.values(StageModeRequestEnum))),
    modType: types.maybeNull(types.enumeration(Object.values(ModerationEnum))),
    spaceIntegrationUsers: types.maybe(types.array(IntegrationUser)),
    data: types.maybeNull(IntegrationData)
  })
);

export {Integration};
