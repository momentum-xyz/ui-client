import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useObject} from '@momentum-xyz/sdk';
import {SpacePage, ObjectTopBar} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {useStore, useGooglePicker} from 'shared/hooks';

import {GoogleDocument, GoogleChoice} from './components/templates';
import {GoogleDriveActions} from './components/atoms';
import * as styled from './GoogleDrivePage.styled';

const GoogleDrivePage: FC = () => {
  const store = useStore();
  const {api, googleDriveStore} = store;
  const {googleDocument} = googleDriveStore;

  const {t} = useI18n();

  const {objectId, isAdmin, pluginApi, isExpanded, onClose, onToggleExpand} = useObject();
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
        title={t('plugin_gd.labels.googleDrive')}
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
