import React, {FC} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import * as styled from './TravellerBox.styled';

const TravellerBox: FC = () => {
  const {t} = useI18n();

  return (
    <Box>
      <styled.Div>
        <Text size="s" text={t('messages.hello_title')} align="left" />
        <div>
          <Text size="s" text={t('messages.hello_one')} align="left" />
          <Text size="s" text={t('messages.hello_two')} align="left" />
          <Text size="s" text={t('messages.hello_three')} align="left" />
        </div>
      </styled.Div>
    </Box>
  );
};

export default TravellerBox;
