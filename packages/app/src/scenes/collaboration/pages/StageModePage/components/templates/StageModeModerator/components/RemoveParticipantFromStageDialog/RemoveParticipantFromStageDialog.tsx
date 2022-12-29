import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';
import {Dialog, Text} from '@momentum-xyz/ui-kit';

import {AgoraRemoteUserInterface} from 'core/models';
import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './RemoveParticipantFromStageDialog.styled';

const DIALOG_WIDTH = '360px';

interface PropsInterface {
  participant: AgoraRemoteUserInterface;
}

const RemoveParticipantFromStageDialog: FC<PropsInterface> = ({participant}) => {
  const {collaborationStore, mainStore} = useStore();
  const {agoraStore_OLD} = mainStore;
  const {agoraStageModeStore} = agoraStore_OLD;

  const {t} = useTranslation();

  const handleUserKick = useCallback(async () => {
    collaborationStore.removeParticipantFromStageDialog.close();
    const success = await agoraStageModeStore.kickUserOffStage(participant.uid.toString());

    if (!success) {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.offStageFailure', {
            user: participant.name
          })}
          showCloseButton
        />
      );
    }
  }, [
    agoraStageModeStore,
    collaborationStore.removeParticipantFromStageDialog,
    participant.name,
    participant.uid,
    t
  ]);

  return (
    <Dialog
      title={t('titles.removeParticipantFromStage')}
      layoutSize={{width: DIALOG_WIDTH}}
      approveInfo={{
        title: t('actions.confirmRemove'),
        onClick: handleUserKick,
        disabled: agoraStageModeStore.isKickingUser
      }}
      declineInfo={{
        title: t('actions.noCancel'),
        onClick: collaborationStore.unselectUserToRemoveAndCloseDialog
      }}
    >
      <styled.Container data-testid="RemoveParticipantFromStageDialog-test">
        <Text
          text={t('messages.areYouSureYouWantToRemoveUserFromStage', {name: participant.name})}
          size="m"
          align="left"
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(RemoveParticipantFromStageDialog);
