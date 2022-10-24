import {flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel, Dialog} from '@momentum-xyz/core';

import {Space} from 'core/models';
import {api} from 'api';

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
      space: types.maybe(Space),
      spaceDetailsFormStore: types.optional(SpaceDetailsFormStore, {}),
      deleteSpaceConfirmationDialog: types.optional(Dialog, {}),
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
