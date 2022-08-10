import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';

import {Text} from 'ui-kit';

import * as styled from './MaxVideoStreams.styled';

interface PropsInterface {
  isShown: boolean;
}

const MaxVideoStreams: FC<PropsInterface> = ({isShown}) => {
  const {t} = useTranslation();

  if (!isShown) {
    return <></>;
  }

  return (
    <styled.Container>
      <styled.Message>
        <Text text={t('messages.videoLimitReached')} transform="uppercase" size="xxs" />
      </styled.Message>
    </styled.Container>
  );
};

export default observer(MaxVideoStreams);
