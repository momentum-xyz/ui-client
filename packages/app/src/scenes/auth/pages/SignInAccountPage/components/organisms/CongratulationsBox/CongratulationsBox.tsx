import React, {FC} from 'react';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {Box} from 'ui-kit';

import * as styled from './CongratulationsBox.styled';

interface PropsInterface {
  amount: string;
}

const CongratulationsBox: FC<PropsInterface> = ({amount}) => {
  const {t} = useTranslation();
  return (
    <Box>
      <styled.Div>
        <Text size="m" text={t('messages.congratulations')} align="left" />
        <Text size="m" text={t('messages.recievedAmmountOfTokensMessage', {amount})} align="left" />
      </styled.Div>
    </Box>
  );
};

export default CongratulationsBox;
