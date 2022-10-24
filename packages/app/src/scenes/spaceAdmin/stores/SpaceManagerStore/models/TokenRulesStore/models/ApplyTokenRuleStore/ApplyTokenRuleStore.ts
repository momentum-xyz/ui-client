import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {TokenRuleItemModel} from 'core/models';
import {api, TokenRuleSearchResponse} from 'api';

const ApplyTokenRuleStore = types.compose(
  ResetModel,
  types
    .model('ApplyTokenRuleStore', {
      applyRequest: types.optional(RequestModel, {}),
      searchRequest: types.optional(RequestModel, {}),
      selectedTokenRuleId: types.maybe(types.string),
      results: types.optional(types.array(TokenRuleItemModel), [])
    })
    .actions((self) => ({
      search: flow(function* (query: string) {
        const response: TokenRuleSearchResponse = yield self.searchRequest.send(
          api.tokenRuleRepository.searchTokenRule,
          {
            q: query
          }
        );

        if (response) {
          self.results = cast(
            response.results.map((tokenRule) => ({
              ...tokenRule,
              id: tokenRule.tokenGroupUserId
            }))
          );
        }
      }),
      applyTokenRule: flow(function* (userId: string, isAdmin: boolean, spaceId: string) {
        yield self.applyRequest.send(api.spaceRepository.addUser, {
          user: {
            userId,
            spaceId,
            isAdmin
          }
        });
      })
    }))
    .views((self) => ({
      get applyPending() {
        return self.applyRequest.isPending;
      },
      get tokenRuleApplied() {
        return self.applyRequest.isDone;
      }
    }))
);

export {ApplyTokenRuleStore};
