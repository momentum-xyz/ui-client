import {flow, types} from 'mobx-state-tree';
import {t} from 'i18next';
import {RequestModel, ResetModel} from '@momentum-xyz/core';
import {GoogleDocumentInterface} from 'core/interfaces';
import {PluginApiInterface} from '@momentum-xyz/sdk';

const GoogleDriveStore = types.compose(
  ResetModel,
  types
    .model('GoogleDriveStore', {
      api: types.maybe(types.frozen<PluginApiInterface>()),
      request: types.optional(RequestModel, {}),
      googleDocument: types.maybeNull(types.frozen<GoogleDocumentInterface>())
    })
    .actions((self) => ({
      init(api: PluginApiInterface) {
        self.api = api;
      },
      fetchGoogleDocument: flow(function* () {
        if (!self.api) {
          return;
        }

        self.googleDocument = yield self.api.getStateItem<GoogleDocumentInterface>('document');
      }),
      enableGoogleDocument: flow(function* (data: GoogleDocumentInterface) {
        if (!self.api) {
          return;
        }

        yield self.api.setStateItem('document', data);
      }),
      disableGoogleDocument: flow(function* () {
        if (!self.api) {
          return;
        }

        yield self.api.deleteStateItem('document');
      }),
      setGoogleDocument(document: GoogleDocumentInterface) {
        self.googleDocument = document;
      },
      removeGoogleDocument() {
        self.googleDocument = null;
      }
    }))
    .actions((self) => ({
      pickGoogleDocument: flow(function* (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {picker} = (window as any).google;

        if (data[picker.Response.ACTION] === picker.Action.PICKED) {
          const content = data[picker.Response.DOCUMENTS][0];
          const document = {
            id: content[picker.Document.ID],
            name: content[picker.Document.NAME],
            url: content[picker.Document.URL]
          };

          yield self.enableGoogleDocument(document);
        }
      }),
      closeDocument: flow(function* () {
        yield self.disableGoogleDocument();
      })
    }))
    .views((self) => ({
      get documentTitle(): string {
        return self.googleDocument?.name
          ? `${t('labels.googleDrive')} / ${self.googleDocument.name}`
          : t('labels.googleDrive');
      }
    }))
);

export {GoogleDriveStore};
