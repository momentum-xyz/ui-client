import React, {FC, useMemo} from 'react';

import {appVariables} from 'api/constants';
import {usePosBusEvent} from 'shared/hooks';
import {IntegrationTypeEnum} from 'core/enums';

import useCollaboration from '../../../context/Collaboration/hooks/useCollaboration';
import {useOwner} from '../../../hooks/api/useOwner';
import Button from '../../atoms/Button';
import Panel from '../../atoms/Panel';
import Page from '../../molucules/Page';
import GooglePicker from '../../atoms/GooglePicker';
import {
  useIntegrationDisable,
  useIntegrationEnable,
  useIntegrationFetch
} from '../../../context/Integration/hooks/useIntegration';
import {IntegrationData} from '../../../context/Integration/IntegrationTypes';

const GoogleDriveLayout: FC = () => {
  const {collaborationState} = useCollaboration();
  const {collaborationSpace} = collaborationState;
  const [googledrive, , , refetch] = useIntegrationFetch(
    collaborationSpace?.id.toString() ?? '',
    IntegrationTypeEnum.GOOGLE_DRIVE
  );

  const [owner] = useOwner(collaborationSpace?.id || '');

  const userIsInTeam = !!owner?.admin;
  const userIsTeamleader = !!owner?.admin;

  const [addGoogleDriveFile] = useIntegrationEnable();
  const [closeGoogleDrive] = useIntegrationDisable();

  usePosBusEvent('google-drive-file-change', (id) => {
    if (collaborationSpace?.id === id) {
      refetch();
    }
  });

  // @ts-ignore
  const pickerCallBack = (data) => {
    if (
      data[(window as any).google.picker.Response.ACTION] ===
      (window as any).google.picker.Action.PICKED
    ) {
      const doc = data[(window as any).google.picker.Response.DOCUMENTS][0];
      const newDriveFile: IntegrationData = {
        id: doc[(window as any).google.picker.Document.ID],
        name: doc[(window as any).google.picker.Document.NAME],
        // description: doc[(window as any).google.picker.Document.DESCRIPTION],
        // type: doc[(window as any).google.picker.Document.TYPE],
        url: doc[(window as any).google.picker.Document.URL]
        // embedUrl: doc[(window as any).google.picker.Document.EMBEDDABLE_URL]
      };

      if (collaborationSpace) {
        addGoogleDriveFile({
          spaceId: collaborationSpace.id,
          integrationType: IntegrationTypeEnum.GOOGLE_DRIVE,
          data: newDriveFile
        }).then(() => {
          refetch();
        });
      }
    }
  };

  const closeGoogleDriveDocument = () => {
    const newDriveFile = {
      id: '',
      name: '',
      description: '',
      type: '',
      url: '',
      embedUrl: ''
    };
    if (collaborationSpace) {
      closeGoogleDrive({
        integrationType: IntegrationTypeEnum.GOOGLE_DRIVE,
        spaceId: collaborationSpace.id,
        data: newDriveFile
      }).then(() => {
        refetch();
      });
    }
  };

  const openGoogleDriveDialog = useMemo(() => {
    return (
      <GooglePicker
        clientId={appVariables.GOOGLE_API_CLIENT_ID}
        developerKey={appVariables.GOOGLE_API_DEVELOPER_KEY}
        scope={['https://www.googleapis.com/auth/drive.file']}
        onChange={(data) => pickerCallBack(data)}
        onAuthFailed={(data) => console.info('on auth failed:', data)}
        multiselect={false}
        navHidden={false}
        authImmediate={false}
        mimeTypes={[]}
        query=""
        viewId="DOCS"
      >
        <Button type="ghost" size="s">
          open document
        </Button>
      </GooglePicker>
    );
  }, [pickerCallBack]);

  const actions = useMemo(() => {
    if (userIsTeamleader) {
      return (
        <>
          <GooglePicker
            clientId={appVariables.GOOGLE_API_CLIENT_ID}
            developerKey={appVariables.GOOGLE_API_DEVELOPER_KEY}
            scope={['https://www.googleapis.com/auth/drive.file']}
            onChange={(data) => pickerCallBack(data)}
            onAuthFailed={(data) => console.info('on auth failed:', data)}
            multiselect={false}
            navHidden={false}
            authImmediate={false}
            mimeTypes={[]}
            query=""
            viewId="DOCS"
          >
            <Button type="ghost" size="s">
              {googledrive?.data?.url ? 'change document' : 'open document'}
            </Button>
          </GooglePicker>

          {googledrive?.data?.url && (
            <Button type="ghost" size="s" onClick={closeGoogleDriveDocument}>
              close
            </Button>
          )}
        </>
      );
    }
    return null;
  }, [pickerCallBack]);

  const getView = () => {
    if (googledrive?.data?.url) {
      return (
        <Panel grow={true} padding={false}>
          <iframe
            title="Google drive"
            width="800"
            height="500"
            className="w-full h-full"
            src={googledrive?.data.url}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
          />
        </Panel>
      );
    } else if (userIsTeamleader) {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">Your team does not have a Google Drive Document open yet</h2>
            {openGoogleDriveDialog}
          </div>
        </Panel>
      );
    } else if (userIsInTeam) {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">Your team does not have a Google Drive Document open yet</h2>
            <p>Ask your teamleader to visit this page and open a shared document</p>
          </div>
        </Panel>
      );
    } else {
      return (
        <Panel grow={true}>
          <div className="flex flex-col h-full justify-center items-center gap-4">
            <h2 className="font-bold">This team does not have a Google Drive Document open yet</h2>
          </div>
        </Panel>
      );
    }
  };

  return (
    <Page
      title={collaborationState.collaborationSpace?.name || ''}
      subtitle="Google Drive"
      actions={actions}
      collaboration
    >
      {getView()}
    </Page>
  );
};

export default GoogleDriveLayout;
