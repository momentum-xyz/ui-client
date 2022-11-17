import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore, useGooglePicker} from 'shared/hooks';
import {useSpace} from '@momentum-xyz/sdk';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';
import {GoogleDriveActions} from './components/atoms';

const GoogleDrivePage: FC = () => {
  const {api, googleDriveStore} = useStore();
  const {googleDocument} = googleDriveStore;

  const {renderTopBarActions, spaceId, isAdmin, pluginApi} = useSpace();
  const {useStateItemChange, useStateItemRemove} = pluginApi;

  useStateItemChange('document', googleDriveStore.setGoogleDocument);
  useStateItemRemove('document', googleDriveStore.removeGoogleDocument);

  useEffect(() => {
    if (spaceId) {
      googleDriveStore.init(api);
      googleDriveStore.fetchGoogleDocument();
    }

    return () => {
      googleDriveStore.resetModel();
    };
  }, [api, googleDriveStore, spaceId]);

  const {pickDocument} = useGooglePicker(googleDriveStore.pickGoogleDocument);

  useEffect(() => {
    renderTopBarActions({
      main: () => (
        <GoogleDriveActions
          spaceId={spaceId}
          isAdmin={isAdmin}
          googleDocument={googleDocument}
          pickDocument={pickDocument}
          closeDocument={() => {
            if (!spaceId) {
              return;
            }
            googleDriveStore.closeDocument();
          }}
        />
      )
    });
  }, [googleDocument, isAdmin, googleDriveStore, renderTopBarActions, spaceId, pickDocument]);

  if (!spaceId) {
    return null;
  }

  return (
    <styled.Container>
      {!googleDocument?.url ? (
        <GoogleChoice isAdmin={isAdmin} pickDocument={pickDocument} />
      ) : (
        <GoogleDocument documentUrl={googleDocument.url} />
      )}
    </styled.Container>
  );
};

export default observer(GoogleDrivePage);
