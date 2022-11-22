import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore, useGooglePicker} from 'shared/hooks';
import {useSpace} from '@momentum-xyz/sdk';
import {SpacePage, SpaceTopBar} from '@momentum-xyz/ui-kit';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';
import {GoogleDriveActions} from './components/atoms';

const GoogleDrivePage: FC = () => {
  const store = useStore();
  const {api, googleDriveStore} = store;
  const {googleDocument} = googleDriveStore;

  const {spaceId, isAdmin, pluginApi, onClose} = useSpace();
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
    <SpacePage>
      <SpaceTopBar
        title={store.spaceName ?? ''}
        subtitle={googleDocument?.name}
        isAdmin={isAdmin}
        spaceId={spaceId}
        editSpaceHidden
        showChatButton={false}
        onLeave={() => onClose?.()}
        baseLink={`/${spaceId}`}
      >
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
      </SpaceTopBar>
      <styled.Container>
        {!googleDocument?.url ? (
          <GoogleChoice isAdmin={isAdmin} pickDocument={pickDocument} />
        ) : (
          <GoogleDocument documentUrl={googleDocument.url} />
        )}
      </styled.Container>
    </SpacePage>
  );
};

export default observer(GoogleDrivePage);
