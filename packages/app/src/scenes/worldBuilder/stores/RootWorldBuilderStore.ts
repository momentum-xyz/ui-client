import {flow, types} from 'mobx-state-tree';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

import {api, CreateWorldResponse} from 'api';

import {WorldBuilderNameStore} from './WorldBuilderNameStore';
import {WorldBuilderTemplatesStore} from './WorldBuilderTemplatesStore';

const RootWorldBuilderStore = types
  .compose(
    ResetModel,
    types.model('RootWorldBuilderStore', {
      worldBuilderNameStore: types.optional(WorldBuilderNameStore, {}),
      worldBuilderTemplatesStore: types.optional(WorldBuilderTemplatesStore, {}),
      haveAccess: types.maybe(types.boolean),

      permissionsRequest: types.optional(RequestModel, {}),
      createWorldRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    fetchPermissions: flow(function* () {
      const response = yield self.permissionsRequest.send(
        api.worldBuilderRepository.checkPermissions,
        {}
      );

      if (response) {
        self.haveAccess = response.permission;
        return;
      }

      self.haveAccess = false;
    }),
    generateWorld: flow(function* () {
      if (
        !self.worldBuilderTemplatesStore.selectedTemplate ||
        !self.worldBuilderNameStore.name ||
        !self.worldBuilderNameStore.subdomain
      ) {
        return;
      }

      const response: CreateWorldResponse = yield self.createWorldRequest.send(
        api.worldBuilderRepository.createWorld,
        {
          templateId: self.worldBuilderTemplatesStore.selectedTemplate.id,
          domain: self.worldBuilderNameStore.subdomain,
          worldName: self.worldBuilderNameStore.name
        }
      );

      return response?.builder_url;
    })
  }))
  .views((self) => ({
    get canAccessPages(): boolean {
      return self.permissionsRequest.isPending || self.haveAccess === false;
    },
    get canGenerateWorld(): boolean {
      if (
        !self.worldBuilderTemplatesStore.selectedTemplate ||
        !self.worldBuilderNameStore.name ||
        !self.worldBuilderNameStore.subdomain
      ) {
        return false;
      }

      return !(self.createWorldRequest.isPending || self.createWorldRequest.isDone);
    }
  }));

export {RootWorldBuilderStore};
