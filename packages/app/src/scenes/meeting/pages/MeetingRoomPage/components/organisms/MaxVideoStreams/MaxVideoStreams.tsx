import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Text} from '@momentum-xyz/ui-kit';

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
    <styled.Container data-testid="MaxVideoStreams-test">
      <styled.Message>
        <Text text={t('messages.videoLimitReached')} size="xxs" />
      </styled.Message>
    </styled.Container>
  );
};

export default observer(MaxVideoStreams);
