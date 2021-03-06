import {flow, types, cast} from 'mobx-state-tree';
import {t} from 'i18next';

import {api, GoogleDocumentInterface} from 'api';
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
          integrationType: IntegrationTypeEnum.GOOGLE_DRIVE,
          spaceId: spaceId
        });

        if (response) {
          self.googleDocument = cast(response);
        }
      }),
      enableGoogleDocument: flow(function* (spaceId: string, data: GoogleDocumentInterface) {
        yield self.request.send(api.integrationRepository.enableGoogleDriveIntegration, {
          spaceId: spaceId,
          data: data
        });
      }),
      disableGoogleDocument: flow(function* (spaceId: string) {
        yield self.request.send(api.integrationRepository.disableGoogleDriveIntegration, {
          spaceId: spaceId
        });
      })
    }))
    .views((self) => ({
      get documentTitle(): string {
        return self.googleDocument?.data?.name
          ? `${t('labels.googleDrive')} / ${self.googleDocument.data.name}`
          : t('labels.googleDrive');
      }
    }))
);

export {GoogleDriveStore};
