import React, {FC, useCallback, useEffect} from 'react';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {Dialog, Text, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './RemoveTileDialog.styled';

const RemoveTileDialog: FC = () => {
  const {collaborationStore} = useStore();
  const {dashboardStore, spaceStore} = collaborationStore;
  const {tileRemoveDialog, tileFormStore, dashboard} = dashboardStore;

  useEffect(() => {
    return () => tileFormStore.resetModel();
  }, []);

  const confirm = useCallback(async () => {
    const succeed = await tileFormStore.deleteTile();
    tileRemoveDialog.close();
    if (succeed) {
      await dashboard.fetchDashboard(spaceStore.space.id ?? '');
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tileRemoveSuccess')}
        />,
        TOAST_COMMON_OPTIONS
      );
    } else {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.tileRemoveError')}
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, []);

  return (
    <Dialog
      title={t('dashboard.removeTileForm.title')}
      approveInfo={{
        title: t('actions.no'),
        onClick: tileRemoveDialog.close
      }}
      declineInfo={{
        title: t('actions.remove'),
        onClick: confirm
      }}
      onClose={tileRemoveDialog.close}
      showCloseButton
      hasBorder
      closeOnBackgroundClick={false}
    >
      <styled.Container>
        <Text text={t('dashboard.removeTileForm.message')} size="m" />
      </styled.Container>
    </Dialog>
  );
};

export default RemoveTileDialog;
