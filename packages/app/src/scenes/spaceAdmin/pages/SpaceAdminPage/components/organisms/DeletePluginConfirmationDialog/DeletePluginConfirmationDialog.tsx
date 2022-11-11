import React, {FC, useMemo} from 'react';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {Dialog, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

interface PropsInterface {
  spaceId: string;
}

const DeletePluginConfirmationDialog: FC<PropsInterface> = ({spaceId}) => {
  const {mainStore, spaceAdminStore} = useStore();
  const {pluginsStore} = mainStore;
  const {spaceManagerStore} = spaceAdminStore;
  const {deletePluginConfirmationDialog} = spaceManagerStore;
  const {pluginToRemove} = pluginsStore;

  const theme = useTheme();
  const {t} = useTranslation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pluginName = useMemo(() => pluginToRemove?.name, []);

  const handleConfirm = async () => {
    try {
      await pluginsStore.removePluginFromSpace(spaceId);

      toast.info(
        <ToastContent
          showCloseButton
          headerIconName="alert"
          title={t('titles.success')}
          text={t('messages.pluginRemovedSuccessfully', {pluginName: pluginName})}
        />
      );
    } catch {
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          title={t('titles.error')}
          text={t('messages.errorWhileRemovingPlugin', {pluginName: pluginName})}
        />
      );
    }
    deletePluginConfirmationDialog.close();
  };

  const handleClose = () => {
    deletePluginConfirmationDialog.close();
    pluginsStore.choosePluginToRemove(undefined);
  };

  return (
    <Dialog
      title={t('titles.deletePluginFromSpace')}
      hasBorder
      theme={theme}
      approveInfo={{
        title: t('actions.remove'),
        onClick: handleConfirm,
        variant: 'danger',
        icon: 'bin',
        disabled: pluginsStore.isRemovePluginPeding
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: handleClose,
        variant: 'primary',
        disabled: pluginsStore.isRemovePluginPeding
      }}
    >
      <Text text={t('messages.deletePluginConfirmation', {pluginName: pluginName})} size="s" />
      <br />
    </Dialog>
  );
};

export default observer(DeletePluginConfirmationDialog);
