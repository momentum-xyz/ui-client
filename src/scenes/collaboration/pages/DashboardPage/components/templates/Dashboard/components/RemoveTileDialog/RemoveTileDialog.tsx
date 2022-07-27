import React, {FC} from 'react';
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
  const {tileFormRequest} = tileFormStore;

  const confirm = async () => {
    await tileFormStore.deleteTile();
    tileRemoveDialog.close();
    if (tileFormRequest.isDone) {
      await dashboard.fetchDashboard(spaceStore.space.id);
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="Your tile has been successfully deleted"
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    } else if (tileFormRequest.isError) {
      toast.error(
        <ToastContent
          headerIconName="alert"
          title={t('titles.alert')}
          text="There was a problem deleting your tile"
          isCloseButton
        />,
        TOAST_COMMON_OPTIONS
      );
    }
  };

  return (
    <Dialog
      title="remove Tile from dashboard"
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
    >
      <styled.Container>
        <Text text="Are you sure you want to remove this tile?" size="m" />
      </styled.Container>
    </Dialog>
  );
};

export default RemoveTileDialog;
