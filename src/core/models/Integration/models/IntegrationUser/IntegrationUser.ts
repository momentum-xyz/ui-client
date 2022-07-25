import {types} from 'mobx-state-tree';

import {UUIDModel} from 'core/models';

import {IntegrationUserData} from './models';

const IntegrationUser = types.model('IntegrationUser', {
  userId: UUIDModel,
  spaceId: types.frozen<Buffer>(),
  integrationTypeId: types.frozen<Buffer>(),
  flag: types.number,
  data: IntegrationUserData
});

export {IntegrationUser};
