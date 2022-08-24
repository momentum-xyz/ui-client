import {flow, types} from 'mobx-state-tree';

import {DialogModel, RequestModel, ResetModel, Space} from 'core/models';
import {api} from 'api';

import {SearchUsersStore, SpaceDetailsFormStore, TokenRulesStore} from './models';

const SpaceManagerStore = types.compose(
  ResetModel,
  types
    .model('SpaceManagerStore', {
      tokenDialog: types.optional(DialogModel, {}),
      tokenRuleReviewDialog: types.optional(DialogModel, {}),
      tokenFormDialog: types.optional(DialogModel, {}),
      applyTokenRuleFormDialog: types.optional(DialogModel, {}),
      tokenRuleFormDialog: types.optional(DialogModel, {}),
      space: types.maybe(Space),
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
      tokenRulesStore: types.optional(TokenRulesStore, {})
    })
    .actions((self) => ({
      init(spaceId: string) {
        self.space = Space.create({id: spaceId});
        self.space.fetchSpaceInformation();
        self.space.fetchAllowedSubSpaceTypes();
        self.tokenRulesStore.fetchTokenRules(spaceId);
        self.tokenRulesStore.fetchOptions();
      },
      deleteSubSpace: flow(function* (spaceId: string) {
        yield self.removeSubSpaceRequest.send(api.spaceRepository.deleteSpace, {spaceId});
      })
    }))
);

export {SpaceManagerStore};
