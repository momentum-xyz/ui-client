import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';

import {ToastContent} from 'ui-kit/molecules';

interface PropsInterface {
  message: string;
  sendBack: () => void;
}

const HighFiveContent: FC<PropsInterface> = ({message, sendBack}) => {
  const [clicked, setClicked] = useState(false);

  const {t} = useTranslation();

  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
      setTimeout(() => sendBack(), 500);
    }
  };

  return (
    <ToastContent
      headerIconName="hand"
      text={t('messages.highFiveReceivedText')}
      title={t('messages.highFiveReceivedTitle', {
        name: message.trim().split(' ').slice(0, 4).join(' ')
      })}
      approveInfo={{title: t('titles.returnHighFive'), onClick: handleClick}}
    />
  );
};

export default HighFiveContent;
