import {FC} from 'react';
import {Dialog} from '@momentum-xyz/ui-kit-storybook';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';

import * as styled from './DeleteSkyboxDialog.styled';

const DeleteSkyboxDialog: FC = () => {
  const {widgetStore, universeStore, sessionStore} = useStore();
  const {creatorStore} = widgetStore;
  const {skyboxSelectorStore} = creatorStore;
  const {deleteDialog, closeSkyboxDeletion, removeUserSkybox, skyboxToDelete, currentItemId} =
    skyboxSelectorStore;
  const worldId = universeStore.worldId;
  const {user} = sessionStore;

  const deletingCurrentSkybox = skyboxToDelete?.id === currentItemId;

  const {t} = useI18n();

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
