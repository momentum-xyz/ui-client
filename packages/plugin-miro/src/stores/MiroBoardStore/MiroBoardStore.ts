import {flow, types, cast, Instance} from 'mobx-state-tree';
import {t} from 'i18next';
import {AxiosInstance} from 'axios';
import {api, FetchIntegrationResponse, MiroBoardInterface} from 'api';
import {Integration} from 'core/models';
import {appVariables} from 'api/constants';
import {RequestModel} from '@momentum/core';
import {ResetModel} from '@momentum/sdk';

const MiroBoardStore = types.compose(
  ResetModel,
  types
    .model('MiroBoardStore', {
      request: types.optional(RequestModel, {}),
      miroBoard: types.maybe(Integration)
    })
    .actions((self) => ({
      fetchMiroBoard: flow(function* (spaceId: string, request: AxiosInstance) {
        const response: FetchIntegrationResponse = yield self.request.send(
          api.integrationRepository.fetchIntegration,
          {spaceId},
          request
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
        yield self.request.send(
          api.integrationRepository.enableMiroIntegration,
          {
            spaceId: spaceId,
            data: data
          },
          request
        );
      }),
      disableMiroBoard: flow(function* (spaceId: string, request: AxiosInstance) {
        yield self.request.send(
          api.integrationRepository.disableMiroIntegration,
          {
            spaceId: spaceId,
            data: {id: '', name: '', description: '', viewLink: '', accessLink: '', embedHtml: ''}
          },
          request
        );
      })
    }))
    .actions((self) => ({
      pickBoard(spaceId: string, request: AxiosInstance) {
        miroBoardsPicker.open({
          action: 'access-link',
          clientId: appVariables.APP_ID,
          success: async (data: MiroBoardInterface) => {
            await self.enableMiroBoard(spaceId, data, request);
            await self.fetchMiroBoard(spaceId, request);
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

export type MiroBoardStoreType = Instance<typeof MiroBoardStore>;

export {MiroBoardStore};
