import {flow, Instance, types} from 'mobx-state-tree';

import {
  RequestModel,
  ResetModel,
  TokenRuleItemModel,
  TokenRuleItemModelInterface
} from 'core/models';
import {api} from 'api';
import {TokenRuleReviewStatus} from 'core/enums';

const TokenRuleReviewStore = types.compose(
  ResetModel,
  types
    .model('TokenRuleReviewStore', {
      isWorldList: types.boolean,
      currentTokenRule: types.maybeNull(TokenRuleItemModel),
      deleteTokeRuleRequest: types.optional(RequestModel, {}),
      tokenRuleRequest: types.optional(RequestModel, {}),
      acceptTokenRuleRequest: types.optional(RequestModel, {}),
      declineTokenRuleRequest: types.optional(RequestModel, {})
    })
    .actions((self) => ({
      review(tokenRule: TokenRuleItemModelInterface) {
        self.currentTokenRule = {
          ...tokenRule
        };
      },
      delete: flow(function* () {
        if (!self.currentTokenRule?.id) {
          return;
        }

        yield self.deleteTokeRuleRequest.send(api.tokenRuleRepository.deleteTokenRule, {
          tokenRuleId: self.currentTokenRule?.id
        });

        return self.deleteTokeRuleRequest.isDone;
      }),
      approve: flow(function* () {
        if (!self.currentTokenRule?.id) {
          return;
        }

        yield self.acceptTokenRuleRequest.send(api.tokenRuleRepository.processTokenRule, {
          tokenRuleId: self.currentTokenRule.id,
          status: TokenRuleReviewStatus.APPROVED
        });

        return self.acceptTokenRuleRequest.isDone;
      }),
      decline: flow(function* () {
        if (!self.currentTokenRule?.id) {
          return;
        }

        yield self.declineTokenRuleRequest.send(api.tokenRuleRepository.processTokenRule, {
          tokenRuleId: self.currentTokenRule.id,
          status: TokenRuleReviewStatus.DENIED
        });

        return self.declineTokenRuleRequest.isDone;
      }),
      deleteTokenRule: flow(function* (tokenRuleId: string) {
        yield self.deleteTokeRuleRequest.send(api.tokenRuleRepository.deleteTokenRule, {
          tokenRuleId: tokenRuleId
        });

        return self.deleteTokeRuleRequest.isDone;
      })
    }))
    .views((self) => ({
      get isPending(): boolean {
        return self.tokenRuleRequest.isPending;
      }
    }))
);

export interface TokenRuleReviewStoreInterface extends Instance<typeof TokenRuleReviewStore> {}

export {TokenRuleReviewStore};
