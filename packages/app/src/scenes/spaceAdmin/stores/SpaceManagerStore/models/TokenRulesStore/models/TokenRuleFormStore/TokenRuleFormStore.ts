import {flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {api, TokenRuleFormInterface} from 'api';

const TokenRuleFormStore = types.compose(
  ResetModel,
  types
    .model('TokenRuleFormStore', {
      tokenRuleFormRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      createTokenRule: flow(function* (data: TokenRuleFormInterface, spaceId: string) {
        yield self.tokenRuleFormRequest.send(api.tokenRuleRepository.createTokenRule, {
          spaceId,
          data
        });
      })
    }))
    .views((self) => ({
      get createTokenRuleLoading() {
        return self.tokenRuleFormRequest.isPending;
      },
      get tokenRuleCreated() {
        return self.tokenRuleFormRequest.isDone;
      }
    }))
);

export {TokenRuleFormStore};
