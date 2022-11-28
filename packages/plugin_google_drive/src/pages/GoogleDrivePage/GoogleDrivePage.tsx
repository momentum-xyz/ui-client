import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore, useGooglePicker} from 'shared/hooks';
import {useObject} from '@momentum-xyz/sdk';
import {SpacePage, ObjectTopBar} from '@momentum-xyz/ui-kit';

import {GoogleDocument, GoogleChoice} from './components/templates';
import * as styled from './GoogleDrivePage.styled';
import {GoogleDriveActions} from './components/atoms';

const GoogleDrivePage: FC = () => {
  const store = useStore();
  const {api, googleDriveStore} = store;
  const {googleDocument} = googleDriveStore;

  const {objectId, pluginName, isAdmin, pluginApi, isExpanded, onClose, onToggleExpand} =
    useObject();
  const {useStateItemChange, useStateItemRemove} = pluginApi;

  useStateItemChange('document', googleDriveStore.setGoogleDocument);
  useStateItemRemove('document', googleDriveStore.removeGoogleDocument);

  useEffect(() => {
    if (objectId) {
      googleDriveStore.init(api);
      googleDriveStore.fetchGoogleDocument();
    }

    return () => {
      googleDriveStore.resetModel();
    };
  }, [api, googleDriveStore, objectId]);

  const {pickDocument} = useGooglePicker(googleDriveStore.pickGoogleDocument);

  if (!objectId) {
    return null;
  }

  return (
    <SpacePage>
      <ObjectTopBar
        title={pluginName ?? ''}
        subtitle={googleDocument?.name}
        isExpanded={isExpanded}
        onClose={() => onClose?.()}
        onToggleExpand={onToggleExpand}
      >
        <GoogleDriveActions
          objectId={objectId}
          isAdmin={isAdmin}
          googleDocument={googleDocument}
          pickDocument={pickDocument}
          closeDocument={() => {
            if (!objectId) {
              return;
            }
            googleDriveStore.closeDocument();
          }}
        />
      </ObjectTopBar>
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
