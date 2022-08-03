import React, {FC, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {observer} from 'mobx-react-lite';

import {AgoraRemoteUserInterface} from 'core/models';
import {useStore} from 'shared/hooks';
import {Dialog, Text, ToastContent} from 'ui-kit';

import * as styled from './RemoveParticipantFromStageDialog.styled';

interface PropsInterface {
  participant: AgoraRemoteUserInterface;
}

const RemoveParticipantFromStageDialog: FC<PropsInterface> = ({participant}) => {
  const {collaborationStore, mainStore} = useStore();
  const {agoraStore} = mainStore;
  const {agoraStageModeStore} = agoraStore;

  const {t} = useTranslation();

  const handleUserKick = useCallback(async () => {
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
          isCloseButton
        />
      );
    }
  }, [agoraStageModeStore, participant.name, participant.uid, t]);

  return (
    <Dialog
      title={t('titles.removeParticipantFromStage')}
      approveInfo={{
        title: t('actions.confirmRemove'),
        onClick: handleUserKick
      }}
      declineInfo={{
        title: t('actions.noCancel'),
        onClick: collaborationStore.unselectUserToRemoveAndCloseDialog
      }}
    >
      <styled.Container>
        <Text
          text={t('messages.areYouSureYouWantToRemoveUserFromStage', {name: participant.name})}
          size="m"
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(RemoveParticipantFromStageDialog);
