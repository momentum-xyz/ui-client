import React from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {Dialog, Text} from '@momentum-xyz/ui-kit';

import {StageModeRequestEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './InvitedOnStageDialog.styled';

interface PropsInterface {
  onClose?: () => void;
  onGetReady?: () => void;
  onDecline?: () => void;
}

const InvitedOnStageDialog: React.FC<PropsInterface> = ({onDecline, onClose, onGetReady}) => {
  const {collaborationStore, mainStore} = useStore();
  const {agoraStore_OLD} = mainStore;
  const {agoraStageModeStore, userDevicesStore} = agoraStore_OLD;

  const {t} = useTranslation();

  const handleEnterStage = async () => {
    await agoraStageModeStore.invitationRespond(StageModeRequestEnum.ACCEPT);

    if (agoraStageModeStore.isStageFull) {
      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('titles.stageIsFull')}
          text={t('messages.stageIsFullTryAgain')}
          showCloseButton
        />
      );

      return;
    }

    agoraStageModeStore.enterStage(userDevicesStore.createLocalTracks);
    onClose?.();
  };

  return (
    <Dialog
      title={t('titles.youHaveBeenInvitedOnStage')}
      onClose={onClose}
      showCloseButton
      approveInfo={
        collaborationStore.isModerator
          ? {
              title: t('actions.goOnStage'),
              onClick: handleEnterStage
            }
          : {
              title: t('actions.getReady'),
              onClick: () => {
                if (onGetReady) {
                  onGetReady();
                  onClose?.();
                }
              }
            }
      }
      declineInfo={{
        title: t('actions.decline'),
        onClick: () => {
          onDecline?.();
        }
      }}
    >
      <styled.Body data-testid="InvitedOnStageDialog-test">
        <Text text={t('messages.wouldYouLikeToGoOnStage')} size="m" align="left" />
        <Text text={t('messages.thisWillEnableYouToUseStage')} size="xs" align="left" />
      </styled.Body>
    </Dialog>
  );
};

export default InvitedOnStageDialog;
