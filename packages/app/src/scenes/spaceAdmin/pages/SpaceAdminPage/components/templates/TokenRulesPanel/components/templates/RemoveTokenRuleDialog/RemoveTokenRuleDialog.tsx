import React, {FC} from 'react';
import {Dialog, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();

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
