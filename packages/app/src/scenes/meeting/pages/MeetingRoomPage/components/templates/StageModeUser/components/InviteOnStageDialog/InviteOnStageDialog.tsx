import React from 'react';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';

import {Dialog, ToastContent, Text} from 'ui-kit';
import {StageModeUserInterface} from 'core/models';

import * as styled from './InviteOnStageDialog.styled';

interface PropsInterface {
  user: StageModeUserInterface;
  inviteToStage: (userId: string) => Promise<boolean>;
  onClose: () => void;
}

const DIALOG_WIDTH = '360px';

const InviteOnStageDialog: React.FC<PropsInterface> = (props) => {
  const {user, inviteToStage, onClose} = props;

  const {t} = useTranslation();

  const handleInviteClick = async () => {
    if (await inviteToStage(user.uid)) {
      onClose();
    } else {
      toast.error(
        <ToastContent
          isDanger
          headerIconName="alert"
          title={t('titles.alert')}
          text={t('messages.inviteToStageFailure', {user: user.name})}
          showCloseButton
        />
      );
    }
  };

  return (
    <Dialog
      title={user.name}
      onClose={onClose}
      showCloseButton
      layoutSize={{width: DIALOG_WIDTH}}
      approveInfo={{
        title: t('actions.inviteToStage'),
        onClick: handleInviteClick
      }}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: onClose
      }}
    >
      <styled.Body data-testid="InviteOnStageDialog-test">
        <Text text={t('actions.inviteThisPersonToTheStage')} size="s" align="left" />
        <Text text={t('messages.thisWillEnablePersonToUseStage')} size="xs" align="left" />
      </styled.Body>
    </Dialog>
  );
};

export default InviteOnStageDialog;
