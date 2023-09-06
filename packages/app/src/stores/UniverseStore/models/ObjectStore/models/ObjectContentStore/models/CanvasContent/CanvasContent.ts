import {cast, flow, types} from 'mobx-state-tree';
import {AttributeNameEnum} from '@momentum-xyz/sdk';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {PluginIdEnum} from 'api/enums';
import {CanvasConfigInterface} from 'api/interfaces';
import {
  api,
  ContributionItemInterface,
  GetSpaceAttributeResponse,
  GetUserContributionsResponse
} from 'api';

const CanvasContent = types
  .compose(
    ResetModel,
    types.model('CanvasContent', {
      pluginId: '',
      objectId: '',

      config: types.maybeNull(types.frozen<CanvasConfigInterface>()),
      contributions: types.optional(types.array(types.frozen<ContributionItemInterface>()), []),

      configRequest: types.optional(RequestModel, {}),
      fetchRequest: types.optional(RequestModel, {})
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

      if (response) {
        self.contributions = cast(response.items ? response.items : []);
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
      return self.fetchRequest.isPending;
    }
  }));

export {CanvasContent};
