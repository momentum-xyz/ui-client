import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {api} from 'api';
// TODO: Make a SpaceStore under spaceAdmin scene. Move specific stuff from Space_OLD
import {SpaceStore} from 'scenes/collaboration/stores/SpaceStore';

import {SearchUsersStore, SpaceDetailsFormStore, TokenRulesStore} from './models';

const SpaceManagerStore = types.compose(
  ResetModel,
  types
    .model('SpaceManagerStore', {
      tokenDialog: types.optional(Dialog, {}),
      tokenRuleReviewDialog: types.optional(Dialog, {}),
      tokenFormDialog: types.optional(Dialog, {}),
      applyTokenRuleFormDialog: types.optional(Dialog, {}),
      tokenRuleFormDialog: types.optional(Dialog, {}),
      // TODO: Make and use SpaceAdminStore
      space: types.optional(SpaceStore, {}),
      spaceDetailsFormStore: types.optional(SpaceDetailsFormStore, {}),
      deleteSpaceConfirmationDialog: types.optional(Dialog, {}),
      addPluginDialog: types.optional(Dialog, {}),
      deletePluginConfirmationDialog: types.optional(Dialog, {}),
      removeUserConfirmationDialog: types.optional(Dialog, {}),
      removeTokenRuleDialog: types.optional(Dialog, {}),
      editUserDialog: types.optional(Dialog, {}),
      editTokenRuleDialog: types.optional(Dialog, {}),
      addUserDialog: types.optional(Dialog, {}),
      searchUsersStore: types.optional(SearchUsersStore, {}),
      removeSubSpaceConfirmationDialog: types.optional(Dialog, {}),
      addSubSpaceDialog: types.optional(Dialog, {}),
      removeSubSpaceRequest: types.optional(RequestModel, {}),
      tokenRulesStore: types.optional(TokenRulesStore, {})
    })
    .actions((self) => ({
      init(spaceId: string) {
        self.space.init(spaceId, false);
        self.space.fetchSpaceInformation();
        self.space.fetchAllowedSubSpaceTypes();
        self.tokenRulesStore.fetchTokenRules(spaceId);
        self.tokenRulesStore.fetchOptions();
      },
      deleteSubSpace: flow(function* (spaceId: string) {
        yield self.removeSubSpaceRequest.send(api.spaceRepositoryOld.deleteSpace, {spaceId});
      })
    }))
);

export {SpaceManagerStore};
