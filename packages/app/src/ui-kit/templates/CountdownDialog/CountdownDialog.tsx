import React, {FC, useEffect, useState} from 'react';
import {t} from 'i18next';
import {Heading, Dialog, Text} from '@momentum/ui-kit';

import * as styled from './CountdownDialog.styled';

interface PropsInterface {
  title: string;
  onSave: () => void;
  onClose: () => void;
  message?: string;
}

const DIALOG_WIDTH = '480px';

const CountdownDialog: FC<PropsInterface> = ({
  onSave,
  onClose,
  title,
  message = t('titles.getReadyToGetLive')
}) => {
  const [countdown, setCountdown] = useState<number>(3);

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
      <styled.Body data-testid="CountdownDialog-test">
        <Text text={message} size="m" />
        <Heading label={`${countdown}`} type="h1" />
      </styled.Body>
    </Dialog>
  );
};

export default CountdownDialog;
