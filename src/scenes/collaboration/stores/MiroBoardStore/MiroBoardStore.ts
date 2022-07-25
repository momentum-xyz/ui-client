import {flow, types, cast} from 'mobx-state-tree';

import {api, MiroBoardInterface} from 'api';
import {IntegrationTypeEnum} from 'core/enums';
import {Integration, RequestModel, ResetModel} from 'core/models';

const MiroBoardStore = types.compose(
  ResetModel,
  types
    .model('MiroBoardStore', {
      request: types.optional(RequestModel, {}),
      miroBoard: types.maybe(Integration)
    })
    .actions((self) => ({
      fetchMiroBoard: flow(function* (spaceId: string) {
        const response = yield self.request.send(api.integrationRepository.fetchIntegration, {
          integrationType: IntegrationTypeEnum.MIRO,
          spaceId: spaceId
        });

        if (response) {
          self.miroBoard = cast(response);
        }
      }),
      enableMiroBoard: flow(function* (spaceId: string, data: MiroBoardInterface) {
        yield self.request.send(api.integrationRepository.enableIntegration, {
          integrationType: IntegrationTypeEnum.MIRO,
          spaceId: spaceId,
          data: data
        });
      }),
      disableMiroBoard: flow(function* (spaceId: string) {
        yield self.request.send(api.integrationRepository.disableIntegration, {
          integrationType: IntegrationTypeEnum.MIRO,
          spaceId: spaceId
        });
      })
    }))
    .views((self) => ({
      get miroBoardTitle(): string {
        return self.miroBoard?.data?.name ? `Miro / ${self.miroBoard.data.name}` : 'Miro';
      }
    }))
);

export {MiroBoardStore};
