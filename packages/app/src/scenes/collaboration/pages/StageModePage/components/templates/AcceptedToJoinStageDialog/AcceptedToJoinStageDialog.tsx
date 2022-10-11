import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {Dialog, Text} from '@momentum/ui-kit';

import * as styled from './AcceptedToJoinStageDialog.styled';

interface PropsInterface {
  onReady?: () => void;
  onDecline?: () => void;
  onClose?: () => void;
}

const DIALOG_WIDTH = '370px';

const AcceptedToJoinOnStageDialog: React.FC<PropsInterface> = ({onReady, onDecline, onClose}) => {
  const {t} = useTranslation();

  return (
    <Dialog
      title={t('titles.yourRequestHasBeenAccepted')}
      layoutSize={{width: DIALOG_WIDTH}}
      onClose={onClose}
      showCloseButton
      approveInfo={{
        title: t('actions.getReady'),
        onClick: () => {
          if (onReady) {
            onReady();
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
      <styled.Body data-testid="AcceptedToJoinOnStageDialog-test">
        <Text text={t('messages.wouldYouLikeToGoOnStage')} size="m" align="left" />
        <Text text={t('messages.thisWillEnableYouToUseStage')} size="xs" align="left" />
      </styled.Body>
    </Dialog>
  );
};

export default memo(AcceptedToJoinOnStageDialog);
