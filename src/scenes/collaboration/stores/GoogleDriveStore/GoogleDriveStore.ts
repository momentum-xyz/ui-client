import {flow, types, cast} from 'mobx-state-tree';

import {api, MiroBoardInterface} from 'api';
import {IntegrationTypeEnum} from 'core/enums';
import {Integration, RequestModel, ResetModel} from 'core/models';

const GoogleDriveStore = types.compose(
  ResetModel,
  types
    .model('GoogleDriveStore', {
      request: types.optional(RequestModel, {}),
      googleDocument: types.maybe(Integration)
    })
    .actions((self) => ({
      fetchGoogleDocument: flow(function* (spaceId: string) {
        const response = yield self.request.send(api.integrationRepository.fetchIntegration, {
          integrationType: IntegrationTypeEnum.MIRO,
          spaceId: spaceId
        });

        if (response) {
          self.googleDocument = cast(response);
        }
      }),
      enableGoogleDocument: flow(function* (spaceId: string, data: MiroBoardInterface) {
        yield self.request.send(api.integrationRepository.enableMiroIntegration, {
          spaceId: spaceId,
          data: data
        });
      }),
      disableGoogleDocument: flow(function* (spaceId: string) {
        yield self.request.send(api.integrationRepository.disableMiroIntegration, {
          spaceId: spaceId
        });
      })
    }))
);

export {GoogleDriveStore};
