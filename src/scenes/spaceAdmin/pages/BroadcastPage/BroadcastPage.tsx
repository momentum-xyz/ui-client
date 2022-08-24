import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {useHistory} from 'react-router';

import {usePosBusEvent, useStore} from 'shared/hooks';
import {PageTopBar, PanelLayout, Text} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {LiveStreamInterface} from 'api';

import * as styled from './BroadcastPage.styled';
import {BroadcastFormPanel, BroadcastPreviewPanel} from './components';

const BroadcastPage: FC = () => {
  const history = useHistory();
  const {collaborationStore, spaceAdminStore} = useStore();
  const {space} = collaborationStore;
  const {broadcastStore} = spaceAdminStore;

  useEffect(() => {
    if (space) {
      broadcastStore.fetchBroadcast(space.id);
    }

    return () => {
      broadcastStore.resetModel();
    };
  }, [broadcastStore, space]);

  const handleClose = () => {
    if (history.location.state?.canGoBack) {
      history.goBack();
    } else {
      history.push(ROUTES.base);
    }
  };

  usePosBusEvent('broadcast', (broadcast: LiveStreamInterface) => {
    broadcastStore.setBroadcast(broadcast);
  });

  if (!space) {
    return null;
  }

  return (
    <styled.Container data-testid="BroadcastPage-test">
      <PageTopBar
        title={space?.name ?? ''}
        subtitle={t('broadcastAdmin.subtitle')}
        onClose={handleClose}
      />
      <styled.Body>
        {space.isAdmin ? (
          <>
            <BroadcastFormPanel />
            <BroadcastPreviewPanel />
          </>
        ) : (
          <styled.NoAccess>
            <PanelLayout isCustom>
              <Text isCustom text={t('spaceAdmin.noAccess')} size="l" />
            </PanelLayout>
          </styled.NoAccess>
        )}
      </styled.Body>
    </styled.Container>
  );
};

export default BroadcastPage;
