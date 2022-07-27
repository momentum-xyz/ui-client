import React, {FC, useEffect} from 'react';
import {t} from 'i18next';
import {toast} from 'react-toastify';

import {Dialog, Text, TOAST_COMMON_OPTIONS, ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './RemoveTileDialog.styled';
interface PropsInterface {}

const RemoveTileDialog: FC<PropsInterface> = () => {
  const {collaborationStore} = useStore();
  const {dashboardManager, spaceStore} = collaborationStore;
  const {tileRemoveDialog, tileFormStore, dashboard} = dashboardManager;
  const {tileDeleteRequest} = tileFormStore;

  useEffect(() => {
    return () => tileFormStore.resetModel();
  }, []);

  const confirm = async () => {
    await tileFormStore.deleteTile();

    if (tileDeleteRequest.isDone) {
      tileRemoveDialog.close();
      await dashboard.fetchDashboard(spaceStore.space.id);
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('titles.tileRemoveSuccess')}
        />,
        TOAST_COMMON_OPTIONS
      );
    } else if (tileDeleteRequest.isError) {
      tileRemoveDialog.close();
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('titles.tileRemoveError')}
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  };

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
