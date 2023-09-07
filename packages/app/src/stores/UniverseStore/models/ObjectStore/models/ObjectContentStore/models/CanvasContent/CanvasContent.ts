import {cast, flow, types} from 'mobx-state-tree';
import {RequestModel, ResetModel} from '@momentum-xyz/core';

import {api, ContributionItemInterface, GetUserContributionsResponse} from 'api';

const CanvasContent = types
  .compose(
    ResetModel,
    types.model('CanvasContent', {
      pluginId: '',
      objectId: '',
      contributions: types.optional(types.array(types.frozen<ContributionItemInterface>()), []),
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
