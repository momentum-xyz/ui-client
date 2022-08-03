import React from 'react';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {Dialog, ToastContent, Text} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {StageModeUserInterface} from 'core/models';

import * as styled from './InviteOnStageDialog.styled';

export interface StageModeInviteToStagePopupProps {
  user?: StageModeUserInterface;
  onClose?: () => void;
}

const DIALOG_WIDTH = '360px';

const InviteOnStageDialog: React.FC<StageModeInviteToStagePopupProps> = ({user, onClose}) => {
  const {agoraStore} = useStore().mainStore;
  const {agoraStageModeStore} = agoraStore;

  const handleInviteClick = async () => {
    if (user) {
      try {
        await agoraStageModeStore.inviteToStage(user.uid);
        onClose?.();
      } catch {
        toast.error(
          <ToastContent
            isDanger
            headerIconName="alert"
            title={t('titles.alert')}
            text={t('messages.inviteToStageFailure', {
              user: user.name
            })}
            isCloseButton
          />
        );
      }
    }
  };

  return (
    <Dialog
      title={user?.name}
      onClose={onClose}
      showCloseButton
      layoutSize={{width: DIALOG_WIDTH}}
      approveInfo={{
        title: t('actions.inviteToStage'),
        onClick: handleInviteClick
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: () => {
          onClose?.();
        }
      }}
    >
      <styled.Body>
        <Text text={t('actions.inviteThisPersonToTheStage')} size="s" align="left" />
        <Text text={t('messages.thisWillEnablePersonToUseStage')} size="xs" align="left" />
      </styled.Body>
    </Dialog>
  );
};

export default observer(InviteOnStageDialog);
