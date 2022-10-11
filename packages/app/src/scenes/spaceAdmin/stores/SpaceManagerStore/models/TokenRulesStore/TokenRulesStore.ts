import {cast, flow, Instance, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum/core';

import {TokenRuleItemModel} from 'core/models';
import {api, FetchTokenRulesResponse} from 'api';
import {TokenTypeModel} from 'core/models/TokenType';
import {NetworkTypeModel} from 'core/models/NetworkType';

import {ApplyTokenRuleStore, TokenFormStore, TokenRuleFormStore} from './models';

const TokenRulesStore = types.compose(
  ResetModel,
  types
    .model('TokenRulesStore', {
      tokenRuleFormStore: types.optional(TokenRuleFormStore, {}),
      applyTokenRuleStore: types.optional(ApplyTokenRuleStore, {}),
      tokenFormStore: types.optional(TokenFormStore, {}),
      tokenRulesRequest: types.optional(RequestModel, {}),
      deleteTokeRuleRequest: types.optional(RequestModel, {}),
      optionRequest: types.optional(RequestModel, {}),
      tokenRules: types.optional(types.array(TokenRuleItemModel), []),
      networks: types.optional(types.array(NetworkTypeModel), []),
      types: types.optional(types.array(TokenTypeModel), [])
    })
    .actions((self) => ({
      fetchTokenRules: flow(function* fetchTokenRules(spaceId?: string, query?: string) {
        const response: FetchTokenRulesResponse = yield self.tokenRulesRequest.send(
          api.tokenRuleRepository.fetchTokenRules,
          {
            spaceId,
            query
          }
        );

        if (response) {
          self.tokenRules = cast(response.tokenRules);
        }
      }),
      fetchOptions: flow(function* fetchOptions() {
        const response = yield self.optionRequest.send(api.tokenRuleRepository.fetchOptions, {});
        if (response) {
          self.networks = cast(
            response.networks.map((network: string) => ({
              value: network,
              label: network.toUpperCase()
            }))
          );
          self.types = cast(
            response.types.map((type: string) => ({
              value: type,
              label: type.toUpperCase()
            }))
          );
        }
      }),
      deleteTokenRule: flow(function* (tokenRuleId: string) {
        yield self.deleteTokeRuleRequest.send(api.tokenRuleRepository.deleteTokenRule, {
          tokenRuleId: tokenRuleId
        });

        return self.deleteTokeRuleRequest.isDone;
      })
    }))
);

export type TokenRulesStoreType = Instance<typeof TokenRulesStore>;

export {TokenRulesStore};
