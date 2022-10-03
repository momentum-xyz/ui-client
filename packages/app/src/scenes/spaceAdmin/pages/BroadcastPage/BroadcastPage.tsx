import React, {FC, useCallback, useEffect} from 'react';
import {t} from 'i18next';
import {useHistory} from 'react-router';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';
import {PageTopBar} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {CountdownDialog, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './BroadcastPage.styled';
import {BroadcastFormPanel, BroadcastPreviewPanel, StopBroadcastingDialog} from './components';

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
    // @ts-ignore
    if (history.location.state?.canGoBack) {
      history.goBack();
    } else {
      history.push(ROUTES.base);
    }
  };

  const handleStartBroadcasting = useCallback(async () => {
    broadcastStore.countdownDialog.close();
    const success = await broadcastStore.enableBroadcast(space?.id ?? '');
    if (success) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.enableSuccess')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.enableError')}
          isDanger
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [broadcastStore, space?.id]);

  const handleStopBroadcasting = useCallback(async () => {
    broadcastStore.stopBroadcastingDialog.close();
    const success = await broadcastStore.disableBroadcast(space?.id ?? '');
    if (success) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.disableSuccess')}
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('broadcastAdmin.disableError')}
          isDanger
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [broadcastStore, space?.id]);

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
            <styled.Panel>
              <styled.Message text={t('spaceAdmin.noAccess')} size="l" />
            </styled.Panel>
          </styled.NoAccess>
        )}
      </styled.Body>
      {broadcastStore.countdownDialog.isOpen && (
        <CountdownDialog
          title={t('broadcastAdmin.broadcastStartDialog')}
          onSave={handleStartBroadcasting}
          onClose={broadcastStore.countdownDialog.close}
          message={t('broadcastAdmin.broadcastStartMessage')}
        />
      )}
      {broadcastStore.stopBroadcastingDialog.isOpen && (
        <StopBroadcastingDialog
          onConfirmation={handleStopBroadcasting}
          onClose={broadcastStore.stopBroadcastingDialog.close}
        />
      )}
    </styled.Container>
  );
};

export default observer(BroadcastPage);
