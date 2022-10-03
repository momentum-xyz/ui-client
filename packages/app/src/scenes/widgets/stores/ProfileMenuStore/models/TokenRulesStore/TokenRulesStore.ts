import {cast, flow, Instance, types} from 'mobx-state-tree';
import {orderBy} from 'lodash';
import {RequestModel, ResetModel} from '@momentum/core';

import {
  DialogModel,
  SortedFieldModel,
  TokenRuleItemModel,
  TokenRuleItemModelInterface
} from 'core/models';
import {TokenTypeModel} from 'core/models/TokenType';
import {NetworkTypeModel} from 'core/models/NetworkType';
import {api, FetchTokenRulesResponse} from 'api';
import {SortDirectionEnum} from 'core/enums';

import {TokenRuleReviewStore} from './models';

const TokenRulesStore = types.compose(
  ResetModel,
  types
    .model('TokenRulesStore', {
      sortedField: types.maybe(SortedFieldModel),
      tokenRules: types.optional(types.array(TokenRuleItemModel), []),
      tokenRuleReviewDialog: types.optional(DialogModel, {}),
      tokenRuleReviewStore: types.optional(TokenRuleReviewStore, {isWorldList: true}),
      widgetDialog: types.optional(DialogModel, {}),
      request: types.optional(RequestModel, {}),
      networks: types.optional(types.array(TokenTypeModel), []),
      types: types.optional(types.array(NetworkTypeModel), [])
    })
    .actions((self) => ({
      reviewTokenRule(tokenRule: TokenRuleItemModelInterface) {
        self.tokenRuleReviewStore.review(tokenRule);
        self.tokenRuleReviewDialog.open();
      },
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
          self.sortedField = {key: field, direction: SortDirectionEnum.DESCENDING};
        } else if (
          self.sortedField.key === field &&
          self.sortedField.direction === SortDirectionEnum.ASCENDING
        ) {
          self.sortedField = {key: field, direction: SortDirectionEnum.DESCENDING};
        } else if (
          self.sortedField.key === field &&
          self.sortedField.direction === SortDirectionEnum.DESCENDING
        ) {
          self.sortedField = {key: field, direction: SortDirectionEnum.ASCENDING};
        }

        self.tokenRules = cast(
          orderBy(self.tokenRules, [self.sortedField.key], [self.sortedField.direction])
        );
      }
    }))
);

export interface TokenRulesStoreInterface extends Instance<typeof TokenRulesStore> {}

export {TokenRulesStore};
