import React, {FC, useCallback, useEffect} from 'react';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {Dialog, Text, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './RemoveTileDialog.styled';

const RemoveTileDialog: FC = () => {
  const {collaborationStore} = useStore();
  const {dashboardStore, space} = collaborationStore;
  const {tileRemoveDialog, tileFormStore} = dashboardStore;

  useEffect(() => {
    return () => tileFormStore.resetModel();
  }, []);

  const confirm = useCallback(async () => {
    if (!space) {
      return;
    }
    const succeed = await tileFormStore.deleteTile();
    tileRemoveDialog.close();
    if (succeed) {
      await dashboardStore.fetchDashboard(space.id);
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
          showCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  }, [dashboardStore, space, tileFormStore, tileRemoveDialog]);

  return (
    <Dialog
      title={t('dashboard.removeTileForm.title')}
      approveInfo={{
        title: t('actions.noCancel'),
        onClick: tileRemoveDialog.close
      }}
      declineInfo={{
        title: t('actions.confirmRemove'),
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
