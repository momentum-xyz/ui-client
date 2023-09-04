import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {User} from 'core/models';
import {PluginIdEnum} from 'api/enums';
import {CanvasConfigInterface, UserContributionInterface} from 'api/interfaces';
import {api, GetSpaceAttributeResponse} from 'api';

const CanvasContent = types
  .compose(
    ResetModel,
    types.model('CanvasContent', {
      pluginId: '',
      objectId: '',

      author: types.maybe(User),
      content: types.maybe(types.frozen<UserContributionInterface>()),
      config: types.maybeNull(types.frozen<CanvasConfigInterface>()),

      configRequest: types.optional(RequestModel, {}),
      fetchRequest: types.optional(RequestModel, {}),
      authorRequest: types.optional(RequestModel, {}),
      deleteRequest: types.optional(RequestModel, {}),
      voteRequest: types.optional(RequestModel, {}),
      voteCountRequest: types.optional(RequestModel, {}),
      commentRequest: types.optional(RequestModel, {}),
      commentListRequest: types.optional(RequestModel, {})
    })
  )
  .actions((self) => ({
    initContent: flow(function* (pluginId: string, objectId: string) {
      self.pluginId = pluginId;
      self.objectId = objectId;

      /*const attributeResponse: UserContributionInterface = yield self.fetchRequest.send(
        api.spaceUserAttributeRepository.getSpaceUserAttribute,
        {
          userId: self.ownerId,
          spaceId: self.objectId,
          pluginId: self.pluginId,
          attributeName: AttributeNameEnum.CANVAS_CONTRIBUTION
        }
      );

      if (attributeResponse) {
        self.content = attributeResponse;
      }*/

      if (self.ownerId) {
        const authorResponse = yield self.authorRequest.send(api.userRepository.fetchUser, {
          userId: '' // self.ownerId
        });

        if (authorResponse) {
          self.author = cast(authorResponse);
        }
      }
    }),
    loadConfig: flow(function* (objectId: string) {
      const configAttribute: GetSpaceAttributeResponse | null = yield self.configRequest.send(
        api.spaceAttributeRepository.getSpaceAttribute,
        {
          spaceId: objectId,
          plugin_id: PluginIdEnum.CANVAS_EDITOR,
          attribute_name: AttributeNameEnum.CANVAS
        }
      );

      if (configAttribute) {
        self.config = cast(configAttribute as CanvasConfigInterface);
      }
    }),
    fetchContent(): void {
      this.initContent(self.pluginId, self.objectId);
    }
  }))
  .views((self) => ({
    get isLoading(): boolean {
      return self.fetchRequest.isPending || self.authorRequest.isPending;
    }
  }));

export {CanvasContent};
