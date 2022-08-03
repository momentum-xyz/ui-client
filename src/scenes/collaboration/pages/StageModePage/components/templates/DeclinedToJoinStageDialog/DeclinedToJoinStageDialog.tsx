import React from 'react';
import {useTranslation} from 'react-i18next';

import {Dialog, Text} from 'ui-kit';

import * as styled from './DeclinedToJoinStageDialog.styled';

interface PropsInterface {
  onClose?: () => void;
}

const DIALOG_WIDTH = '370px';

const DeclinedToJoinStagePopup: React.FC<PropsInterface> = ({onClose}) => {
  const {t} = useTranslation();

  return (
    <Dialog
      title={t('titles.yourRequestWasDeclined')}
      layoutSize={{width: DIALOG_WIDTH}}
      onClose={onClose}
      showCloseButton
      declineInfo={{
        title: t('actions.close'),
        onClick: () => {
          onClose?.();
        }
      }}
    >
      <styled.Body>
        <Text text={t('messages.pleaseTryAgainLater')} size="m" />
      </styled.Body>
    </Dialog>
  );
};

export default DeclinedToJoinStagePopup;
