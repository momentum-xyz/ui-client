import {flow, types, cast} from 'mobx-state-tree';
import {t} from 'i18next';

import {api, FetchIntegrationResponse, MiroBoardInterface} from 'api';
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
        const response: FetchIntegrationResponse = yield self.request.send(
          api.integrationRepository.fetchIntegration,
          {
            integrationType: IntegrationTypeEnum.MIRO,
            spaceId: spaceId
          }
        );

        if (response && self.request.isDone) {
          self.miroBoard = cast(response);
        }
      }),
      enableMiroBoard: flow(function* (spaceId: string, data: MiroBoardInterface) {
        yield self.request.send(api.integrationRepository.enableMiroIntegration, {
          spaceId: spaceId,
          data: data
        });
      }),
      disableMiroBoard: flow(function* (spaceId: string) {
        yield self.request.send(api.integrationRepository.disableMiroIntegration, {
          spaceId: spaceId
        });
      })
    }))
    .views((self) => ({
      get miroBoardTitle(): string {
        return self.miroBoard?.data?.name
          ? `${t('labels.miro')} / ${self.miroBoard.data.name}`
          : t('labels.miro');
      }
    }))
);

export {MiroBoardStore};
