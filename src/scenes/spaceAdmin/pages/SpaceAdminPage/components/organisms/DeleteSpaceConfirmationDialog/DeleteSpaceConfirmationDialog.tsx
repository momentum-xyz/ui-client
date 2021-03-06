import React, {FC} from 'react';
import {t} from 'i18next';

import {Dialog, Text} from 'ui-kit';

import * as styled from './DeleteSpaceConfirmationDialog.styled';

interface PropsInterface {
  onConfirmation: () => void;
  onClose: () => void;
}

const DeleteSpaceConfirmationDialog: FC<PropsInterface> = ({onConfirmation, onClose}) => {
  return (
    <Dialog
      title={t('spaceAdmin.spaceDetails.deleteConfirmation.title')}
      approveInfo={{
        title: t('spaceAdmin.spaceDetails.deleteConfirmation.declineLabel'),
        onClick: onClose
      }}
      declineInfo={{
        title: t('spaceAdmin.spaceDetails.deleteConfirmation.acceptLabel'),
        onClick: onConfirmation
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Text text={t('spaceAdmin.spaceDetails.deleteConfirmation.text')} size="m" />
      </styled.Container>
    </Dialog>
  );
};

export default DeleteSpaceConfirmationDialog;
