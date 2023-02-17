import React, {FC, useCallback, useEffect} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';
import {PageTopBar} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {CountdownDialog, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './BroadcastPage.styled';
import {BroadcastFormPanel, BroadcastPreviewPanel, StopBroadcastingDialog} from './components';

const BroadcastPage: FC = () => {
  const navigate = useNavigate();
  const {collaborationStore, spaceAdminStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {broadcastStore} = spaceAdminStore;

  const {t} = useTranslation();

  useEffect(() => {
    if (spaceStore) {
      broadcastStore.fetchBroadcast(spaceStore.id);
    }

    return () => {
      broadcastStore.resetModel();
    };
  }, [broadcastStore, spaceStore]);

  const handleClose = () => {
    // @ts-ignore
    if (navigate.location.state?.canGoBack) {
      navigate(-1);
    } else {
      navigate(ROUTES.base);
    }
  };

  const handleStartBroadcasting = useCallback(async () => {
    broadcastStore.countdownDialog.close();
    const success = await broadcastStore.enableBroadcast(spaceStore?.id ?? '');
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
  }, [broadcastStore, spaceStore?.id]);

  const handleStopBroadcasting = useCallback(async () => {
    broadcastStore.stopBroadcastingDialog.close();
    const success = await broadcastStore.disableBroadcast(spaceStore?.id ?? '');
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
  }, [broadcastStore, spaceStore?.id]);

  if (!spaceStore) {
    return null;
  }

  return (
    <styled.Container data-testid="BroadcastPage-test">
      <PageTopBar
        title={spaceStore.name ?? ''}
        subtitle={t('broadcastAdmin.subtitle')}
        onClose={handleClose}
      />
      <styled.Body>
        {spaceStore.isAdmin ? (
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
