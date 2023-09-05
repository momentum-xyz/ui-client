import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginIdEnum} from 'api/enums';
import {CanvasConfigInterface, UserContributionWithUserInterface} from 'api/interfaces';
import {api, GetSpaceAttributeResponse, GetUserContributionsResponse} from 'api';

const CanvasContent = types
  .compose(
    ResetModel,
    types.model('CanvasContent', {
      pluginId: '',
      objectId: '',

      config: types.maybeNull(types.frozen<CanvasConfigInterface>()),
      contentArray: types.optional(
        types.array(types.frozen<UserContributionWithUserInterface>()),
        []
      ),

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

      const response: GetUserContributionsResponse = yield self.fetchRequest.send(
        api.canvasRepository.getUserContributions,
        {
          objectId: self.objectId
        }
      );

      // TODO: Items & Interface
      console.log('response', response);

      if (response) {
        console.log(response);
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
