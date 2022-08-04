import React, {FC, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {Dialog, Text, Heading} from 'ui-kit';

import * as styled from './CountdownDialog.styled';

interface PropsInterface {
  title: string;
  onSave: () => void;
  onClose: () => void;
}

const DIALOG_WIDTH = '480px';

const CountdownDialog: FC<PropsInterface> = ({onSave, onClose, title}) => {
  const [countdown, setCountdown] = useState<number>(3);

  const {t} = useTranslation();

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      onSave();
    }
  }, [countdown, onSave]);

  return (
    <Dialog
      title={title}
      layoutSize={{width: DIALOG_WIDTH}}
      onClose={onClose}
      declineInfo={{
        title: t('actions.cancel'),
        onClick: onClose
      }}
    >
      <styled.Body>
        <Text text={t('titles.getReadyToGetLive')} size="m" />
        <Heading label={`${countdown}`} type="h1" />
      </styled.Body>
    </Dialog>
  );
};

export default CountdownDialog;
