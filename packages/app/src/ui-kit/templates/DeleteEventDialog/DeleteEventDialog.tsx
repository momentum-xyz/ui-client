import React, {FC} from 'react';
import {Dialog, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import * as styled from './DeleteEventDialog.styled';

interface PropsInterface {
  onConfirmation: () => void;
  onClose: () => void;
}

const DeleteEventDialog: FC<PropsInterface> = ({onConfirmation, onClose}) => {
  const {t} = useTranslation();
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
      <styled.Container data-testid="DeleteEventConfirmationDialog-test">
        <Text text={t('messages.delete')} size="m" />
      </styled.Container>
    </Dialog>
  );
};

export default DeleteEventDialog;
