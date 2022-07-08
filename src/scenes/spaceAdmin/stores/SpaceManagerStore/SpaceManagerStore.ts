import {flow, types} from 'mobx-state-tree';

import {
  DialogModel,
  RequestModel,
  ResetModel,
  TokenRuleItemModelInterface,
  Space
} from 'core/models';
import {api} from 'api';
import {TokenRulesListStore} from 'scenes/widgets/stores/TokenRulesListStore';
import {TokenRuleReviewStore} from 'scenes/widgets/stores/TokenRuleReviewStore';
import {TokenFormStore} from 'scenes/widgets/stores/TokenFormStore';
import {TokenRuleFormStore} from 'scenes/widgets/stores/TokenRuleFormStore';
import {TokenRulesStore} from 'scenes/widgets/stores/TokenRulesStore';
import {ApplyTokenRuleStore} from 'scenes/widgets/stores/ApplyTokenRuleStore';

import {SpaceDetailsFormStore} from './SpaceDetailsFormStore';
import {SearchUsersStore} from './SearchUsersStore/SearchUsersStore';

const SpaceManagerStore = types.compose(
  ResetModel,
  types
    .model('SpaceManagerStore', {
      tokenDialog: types.optional(DialogModel, {}),
      tokenRuleReviewDialog: types.optional(DialogModel, {}),
      tokenFormDialog: types.optional(DialogModel, {}),
      applyTokenRuleFormDialog: types.optional(DialogModel, {}),
      tokenRuleFormDialog: types.optional(DialogModel, {}),
      tokenRuleReviewStore: types.optional(TokenRuleReviewStore, {isWorldList: false}),
      tokenRulesListStore: types.optional(TokenRulesListStore, {}),
      tokenRuleFormStore: types.optional(TokenRuleFormStore, {}),
      tokenFormStore: types.optional(TokenFormStore, {}),
      applyTokenRuleStore: types.optional(ApplyTokenRuleStore, {}),
      space: types.optional(Space, {}),
      spaceDetailsFormStore: types.optional(SpaceDetailsFormStore, {}),
      deleteSpaceConfirmationDialog: types.optional(DialogModel, {}),
      removeUserConfirmationDialog: types.optional(DialogModel, {}),
      removeTokenRuleDialog: types.optional(DialogModel, {}),
      editUserDialog: types.optional(DialogModel, {}),
      editTokenRuleDialog: types.optional(DialogModel, {}),
      addUserDialog: types.optional(DialogModel, {}),
      searchUsersStore: types.optional(SearchUsersStore, {}),
      removeSubSpaceConfirmationDialog: types.optional(DialogModel, {}),
      addSubSpaceDialog: types.optional(DialogModel, {}),
      removeSubSpaceRequest: types.optional(RequestModel, {}),
      tokenRuleStore: types.optional(TokenRulesStore, {})
    })
    .actions((self) => ({
      init(spaceId: string) {
        self.space.setup(spaceId);
        self.space.fetchSpaceInformation();
        self.space.fetchAllowedSubSpaceTypes();
        self.tokenRulesListStore.fetchTokenRules(spaceId);
        self.tokenRuleStore.fetchOptions();
      },
      reviewTokenRule(tokenRule: TokenRuleItemModelInterface) {
        self.tokenRuleReviewStore.review(tokenRule);
        self.tokenRuleReviewDialog.open();
      },
      deleteSubSpace: flow(function* (spaceId: string) {
        yield self.removeSubSpaceRequest.send(api.spaceRepository.deleteSpace, {spaceId});
      })
    }))
);

export {SpaceManagerStore};
