import React, {FC} from 'react';
import {t} from 'i18next';
import {Dialog, Text} from '@momentum/ui-kit';

import * as styled from './RemoveTokenRuleDialog.styled';
interface PropsInterface {
  userName: string;
  tokenRuleId: string;
  onConfirmation: (id: string) => void;
  onClose: () => void;
}

const RemoveTokenRuleDialog: FC<PropsInterface> = ({
  onConfirmation,
  onClose,
  userName,
  tokenRuleId
}) => {
  const confirm = () => {
    onConfirmation(tokenRuleId);
  };

  return (
    <Dialog
      title={t('tokenRules.removeTokenRuleDialog.title')}
      approveInfo={{
        title: t('actions.noCancel'),
        onClick: onClose
      }}
      declineInfo={{
        title: t('actions.confirmRemove'),
        onClick: confirm
      }}
      onClose={onClose}
      showCloseButton
    >
      <styled.Container>
        <Text
          text={t('tokenRules.removeTokenRuleDialog.message', {
            name: userName
          })}
          size="m"
        />
      </styled.Container>
    </Dialog>
  );
};

export default RemoveTokenRuleDialog;
