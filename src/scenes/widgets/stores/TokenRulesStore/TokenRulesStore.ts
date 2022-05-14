import {cast, flow, Instance, types} from 'mobx-state-tree';

import {
  DialogModel,
  RequestModel,
  ResetModel,
  SortedFieldModel,
  TokenRuleItemModel,
  TokenRuleItemModelInterface
} from 'core/models';
import {TokenRuleReviewStore} from 'scenes/widgets/stores/TokenRuleReviewStore';
import {TokenRulesListStore} from 'scenes/widgets/stores/TokenRulesListStore';
import {api} from 'api';
import {TokenTypeModel} from 'core/models/TokenType';
import {NetworkTypeModel} from 'core/models/NetworkType';

const TokenRulesStore = types.compose(
  ResetModel,
  types
    .model('TokenRulesStore', {
      sortedField: types.maybe(SortedFieldModel),
      tokenRules: types.optional(types.array(TokenRuleItemModel), []),
      tokenRuleReviewDialog: types.optional(DialogModel, {}),
      tokenRuleReviewStore: types.optional(TokenRuleReviewStore, {isWorldList: true}),
      tokenRulesListStore: types.optional(TokenRulesListStore, {}),
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
      fetchOptions: flow(function* fetchOptions() {
        const response = yield self.request.send(api.tokenRuleRepository.fetchOptions, {});
        if (response) {
          self.networks = cast(
            response.networks.map((network) => ({
              value: network,
              label: network.toUpperCase()
            }))
          );
          self.types = cast(
            response.types.map((type) => ({
              value: type,
              label: type.toUpperCase()
            }))
          );
        }
      })
    }))
);

export interface TokenRulesStoreInterface extends Instance<typeof TokenRulesStore> {}

export {TokenRulesStore};
