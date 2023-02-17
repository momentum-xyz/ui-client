import React, {FC} from 'react';
import {Dialog, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import * as styled from './RemoveUserConfirmationDialog.styled';

interface PropsInterface {
  userName: string;
  onConfirmation: () => void;
  onClose: () => void;
}

const RemoveUserConfirmationDialog: FC<PropsInterface> = ({onConfirmation, onClose, userName}) => {
  const {t} = useTranslation();
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
