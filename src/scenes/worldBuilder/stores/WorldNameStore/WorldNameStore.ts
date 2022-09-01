import {flow, types} from 'mobx-state-tree';

import {api, ValidationResponse} from 'api';
import {RequestModel, ResetModel} from 'core/models';

const WorldNameStore = types
  .compose(
    ResetModel,
    types.model('WorldNameStore', {
      validateNameRequest: types.optional(RequestModel, {}),
      validateSubdomainNameRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    validateName: flow(function* (name: string) {
      const response: ValidationResponse = yield self.validateNameRequest.send(
        api.worldBuilderRepository.validateName,
        {
          name
        }
      );

      return response;
    }),
    validateSubdomainName: flow(function* (name: string) {
      const response: ValidationResponse = yield self.validateNameRequest.send(
        api.worldBuilderRepository.valiedateDomain,
        {
          name
        }
      );

      return response;
    })
  }));

export {WorldNameStore};
