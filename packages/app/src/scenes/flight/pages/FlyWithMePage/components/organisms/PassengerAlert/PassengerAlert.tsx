import React, {FC, memo} from 'react';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import * as styled from './PassengerAlert.styled';

const PassengerAlert: FC = () => {
  const {t} = useTranslation();

  return (
    <styled.Content>
      <Text size="s" text={t('messages.flyWithMeBlocked')} align="left" />
    </styled.Content>
  );
};

export default memo(PassengerAlert);
