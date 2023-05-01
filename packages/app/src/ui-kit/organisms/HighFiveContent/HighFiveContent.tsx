import React, {FC, useState} from 'react';
import {useI18n} from '@momentum-xyz/core';

import {ToastContent} from 'ui-kit';

interface PropsInterface {
  message: string;
  sendBack: () => void;
  showCloseButton?: boolean;
}

const HighFiveContent: FC<PropsInterface> = ({message, sendBack, showCloseButton}) => {
  const [clicked, setClicked] = useState(false);

  const {t} = useI18n();

  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
      setTimeout(() => sendBack(), 500);
    }
  };

  return (
    <ToastContent
      icon="stake"
      text={t('messages.highFiveReceivedText')}
      title={t('messages.highFiveReceivedTitle', {
        name: message
      })}
      approveInfo={{title: t('titles.returnHighFive'), onClick: handleClick}}
      showCloseButton={showCloseButton}
    />
  );
};

export default HighFiveContent;
