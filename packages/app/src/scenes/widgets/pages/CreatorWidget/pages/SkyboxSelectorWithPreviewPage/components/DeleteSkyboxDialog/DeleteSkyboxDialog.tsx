import {FC, useEffect} from 'react';
import {
  Dialog // Input
} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';

import * as styled from './DeleteSkyboxDialog.styled';

const DeleteSkyboxDialog: FC = () => {
  const {creatorStore, universeStore, sessionStore} = useStore();
  const {skyboxSelectorStore} = creatorStore;
  const {deleteDialog, closeSkyboxDeletion, removeUserSkybox, skyboxToDelete, currentItemId} =
    skyboxSelectorStore;
  const {world3dStore} = universeStore;
  const worldId = universeStore.worldId;
  const {user} = sessionStore;

  const deletingCurrentSkybox = skyboxToDelete?.id === currentItemId;

  const {t} = useI18n();

  useEffect(() => {
    world3dStore?.changeKeyboardControl(false);
    return () => {
      world3dStore?.changeKeyboardControl(true);
    };
  }, [world3dStore]);

  if (!skyboxToDelete || !user) {
    closeSkyboxDeletion();
    return <></>;
  }

  const confirmDeletion = () => {
    removeUserSkybox(worldId, user.id, skyboxToDelete.id).catch((err: any) => {
      toast.error(err.message);
    });
  };

  return (
    <Dialog
      title={t('labels.removeCustomSkybox')}
      icon="bin"
      hasBorder
      showCloseButton
      onClose={deleteDialog.close}
      approveInfo={{
        title: t('actions.removeSkybox'),
        onClick: confirmDeletion,
        variant: 'danger'
      }}
      declineInfo={{
        title: t('actions.cancel'),
        variant: 'primary',
        onClick: closeSkyboxDeletion
      }}
    >
      <styled.Container>
        <styled.Text>
          {t('messages.removeSkyboxConfirmation')}
          <styled.SkyboxName> "{skyboxToDelete.name}"</styled.SkyboxName>.
        </styled.Text>
        {deletingCurrentSkybox && (
          <styled.Text>{t('messages.removeSkyboxCurrentConfirmation')}</styled.Text>
        )}
        <styled.Text>{t('messages.removeSkyboxFinalConfirmation')}</styled.Text>
      </styled.Container>
    </Dialog>
  );
};

export default observer(DeleteSkyboxDialog);