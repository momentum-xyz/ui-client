import React, {FC} from 'react';
import {Dialog, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import * as styled from './StopBroadcastingDialog.styled';
interface PropsInterface {
  onConfirmation: () => void;
  onClose: () => void;
}

const StopBroadcastingDialog: FC<PropsInterface> = ({onConfirmation, onClose}) => {
  const confirm = () => {
    onConfirmation();
  };

  const {t} = useTranslation();

  return (
    <Dialog
      title={t('broadcastAdmin.broadcastStopTitle')}
      approveInfo={{
        title: t('broadcastAdmin.cancelStop'),
        onClick: onClose
      }}
      declineInfo={{
        title: t('broadcastAdmin.confirmStop'),
        onClick: confirm
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Text text={t('broadcastAdmin.broadcastStopMessage')} size="m" />
      </styled.Container>
    </Dialog>
  );
};

export default StopBroadcastingDialog;
