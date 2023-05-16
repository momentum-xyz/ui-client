import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useObject} from '@momentum-xyz/sdk';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
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

  const {
    objectId,
    isAdmin,
    pluginApi,
    // isExpanded,
    onClose
    // onToggleExpand
  } = useObject();
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
    // It's not really used now and after migration to new ui-kit some additional visual fixes may be need
    <Panel
      variant="primary"
      size="large"
      title={t('plugin_gd.labels.googleDrive')}
      // subtitle={googleDocument?.name}
      // isExpanded={isExpanded}
      onClose={onClose}
      // onToggleExpand={onToggleExpand}
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
      {/* </ObjectTopBar> */}
      <styled.Container>
        {!googleDocument?.url ? (
          <GoogleChoice isAdmin={isAdmin} pickDocument={pickDocument} />
        ) : (
          <GoogleDocument documentUrl={googleDocument.url} />
        )}
      </styled.Container>
    </Panel>
  );
};

export default observer(GoogleDrivePage);
