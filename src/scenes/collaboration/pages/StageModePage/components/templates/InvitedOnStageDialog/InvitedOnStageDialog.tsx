import React from 'react';
import {useTranslation} from 'react-i18next';

import {Dialog, Text} from 'ui-kit';

import * as styled from './InvitedOnStageDialog.styled';

interface PropsInterface {
  onClose?: () => void;
  onGetReady?: () => void;
  onDecline?: () => void;
}

const InvitedOnStageDialog: React.FC<PropsInterface> = ({onDecline, onClose, onGetReady}) => {
  const {t} = useTranslation();

  return (
    <Dialog
      title={t('titles.youHaveBeenInvitedOnStage')}
      onClose={onClose}
      showCloseButton
      approveInfo={{
        title: t('actions.getReady'),
        onClick: () => {
          if (onGetReady) {
            onGetReady();
            onClose?.();
          }
        }
      }}
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
