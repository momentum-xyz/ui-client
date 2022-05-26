import {cast, flow, Instance, types} from 'mobx-state-tree';
import {orderBy} from 'lodash';

import {
  DialogModel,
  RequestModel,
  ResetModel,
  SortedFieldModel,
  TokenRuleItemModel
} from 'core/models';
import {api, FetchTokenRulesResponse} from 'api';
import {SortDirection} from 'core/enums';

const TokenRulesListStore = types.compose(
  ResetModel,
  types
    .model('TokenRulesListStore', {
      worldTokenRulesAdmin: types.optional(DialogModel, {}),
      sortedField: types.maybe(SortedFieldModel),
      tokenRules: types.optional(types.array(TokenRuleItemModel), []),
      tokenRuleReviewDialog: types.optional(DialogModel, {}),
      search: types.optional(types.string, ''),
      request: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      fetchTokenRules: flow(function* fetchTokenRules(spaceId?: string, query?: string) {
        const response: FetchTokenRulesResponse = yield self.request.send(
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
      sortTokens(field: string) {
        if (!self.sortedField || self.sortedField.key !== field) {
          self.sortedField = {key: field, direction: SortDirection.DESCENDING};
        } else if (
          self.sortedField.key === field &&
          self.sortedField.direction === SortDirection.ASCENDING
        ) {
          self.sortedField = {key: field, direction: SortDirection.DESCENDING};
        } else if (
          self.sortedField.key === field &&
          self.sortedField.direction === SortDirection.DESCENDING
        ) {
          self.sortedField = {key: field, direction: SortDirection.ASCENDING};
        }

        self.tokenRules = cast(
          orderBy(self.tokenRules, [self.sortedField.key], [self.sortedField.direction])
        );
      }
    }))
);

export interface TokenRulesListStoreInterface extends Instance<typeof TokenRulesListStore> {}

export {TokenRulesListStore};
