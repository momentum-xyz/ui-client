import React, {FC} from 'react';
import {t} from 'i18next';

import {Dialog, Text} from 'ui-kit';

import * as styled from './DeleteEventConfirmationDialog.styled';

interface PropsInterface {
  onConfirmation: () => void;
  onClose: () => void;
}

const DeleteEventConfirmationDialog: FC<PropsInterface> = ({onConfirmation, onClose}) => {
  return (
    <Dialog
      title={t('messages.pleaseConfirm')}
      approveInfo={{
        title: t('actions.cancel'),
        onClick: onClose
      }}
      declineInfo={{
        title: t('actions.delete'),
        onClick: onConfirmation
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Text text={t('messages.delete')} size="m" />
      </styled.Container>
    </Dialog>
  );
};

export default DeleteEventConfirmationDialog;
