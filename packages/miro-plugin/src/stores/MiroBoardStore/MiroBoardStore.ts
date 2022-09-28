import {flow, types, cast, Instance} from 'mobx-state-tree';
import {t} from 'i18next';
import {AxiosInstance} from 'axios';

import {api, FetchIntegrationResponse, MiroBoardInterface} from 'api';
import {Integration, RequestModel, ResetModel} from 'core/models';
import {appVariables} from 'api/constants';

const MiroBoardStore = types.compose(
  ResetModel,
  types
    .model('MiroBoardStore', {
      request: types.optional(RequestModel, {}),
      miroBoard: types.maybe(Integration)
    })
    .actions((self) => ({
      fetchMiroBoard: flow(function* (spaceId: string, request?: AxiosInstance) {
        const response: FetchIntegrationResponse = yield self.request.send(
          api.integrationRepository.fetchIntegration,
          request,
          {
            integrationType: 'miro',
            spaceId: spaceId
          }
        );

        if (response && self.request.isDone) {
          self.miroBoard = cast(response);
        }
      }),
      enableMiroBoard: flow(function* (
        spaceId: string,
        data: MiroBoardInterface,
        request?: AxiosInstance
      ) {
        yield self.request.send(api.integrationRepository.enableMiroIntegration, request, {
          spaceId: spaceId,
          data: data
        });
      }),
      disableMiroBoard: flow(function* (spaceId: string, request?: AxiosInstance) {
        yield self.request.send(api.integrationRepository.disableMiroIntegration, request, {
          spaceId: spaceId
        });
      })
    }))
    .actions((self) => ({
      pickBoard(spaceId?: string, request?: AxiosInstance) {
        miroBoardsPicker.open({
          action: 'access-link',
          clientId: appVariables.APP_ID,
          success: async (data: MiroBoardInterface) => {
            if (spaceId) {
              await self.enableMiroBoard(spaceId, data);
              await self.fetchMiroBoard(spaceId, request);
            }
          }
        });
      }
    }))
    .views((self) => ({
      get miroBoardTitle(): string {
        return self.miroBoard?.data?.name
          ? `${t('labels.miro')} / ${self.miroBoard.data.name}`
          : t('labels.miro');
      }
    }))
);

export interface MiroBoardStoreInterface extends Instance<typeof MiroBoardStore> {}

export {MiroBoardStore};
