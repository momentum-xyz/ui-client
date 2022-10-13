import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, ValidationResponse} from 'api';

const WorldBuilderNameStore = types
  .compose(
    ResetModel,
    types.model('WorldBuilderNameStore', {
      name: types.maybe(types.string),
      subdomain: types.maybe(types.string),
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
    }),
    submit(name: string, subdomain: string) {
      self.name = name;
      self.subdomain = subdomain;
    }
  }));

export {WorldBuilderNameStore};
