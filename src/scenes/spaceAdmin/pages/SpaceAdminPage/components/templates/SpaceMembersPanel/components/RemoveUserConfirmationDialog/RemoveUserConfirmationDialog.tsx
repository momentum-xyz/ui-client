import React, {FC} from 'react';
import {t} from 'i18next';

import {Dialog, Text} from 'ui-kit';

import * as styled from './RemoveUserConfirmationDialog.styled';

interface PropsInterface {
  userName: string;
  onConfirmation: () => void;
  onClose: () => void;
}

const RemoveUserConfirmationDialog: FC<PropsInterface> = ({onConfirmation, onClose, userName}) => {
  return (
    <Dialog
      title={t('spaceAdmin.users.removeConfirmation.title')}
      approveInfo={{
        title: t('spaceAdmin.users.removeConfirmation.declineLabel'),
        onClick: onClose
      }}
      declineInfo={{
        title: t('spaceAdmin.users.removeConfirmation.acceptLabel'),
        onClick: onConfirmation
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Text text={t('spaceAdmin.users.removeConfirmation.text', {name: userName})} size="m" />
      </styled.Container>
    </Dialog>
  );
};

export default RemoveUserConfirmationDialog;
