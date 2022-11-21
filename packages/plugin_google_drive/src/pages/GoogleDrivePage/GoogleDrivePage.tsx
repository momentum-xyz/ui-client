import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore, useGooglePicker} from 'shared/hooks';
import {useSpace} from '@momentum-xyz/sdk';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';

const GoogleDrivePage: FC = () => {
  const {api, googleDriveStore} = useStore();
  const {googleDocument} = googleDriveStore;

  const {spaceId, isAdmin, pluginApi} = useSpace();
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
