import React, {FC, memo} from 'react';
import {Heading, Text} from '@momentum/ui-kit';
import {useTranslation} from 'react-i18next';

import * as styled from './PassengerAlert.styled';

const PassengerAlert: FC = () => {
  const {t} = useTranslation();

  return (
    <styled.Content>
      <Heading type="h3" label={t('messages.flyWithActivated')} align="left" />
      <Text size="s" text={t('messages.flyWithBlocked')} align="left" isMultiline={false} />
    </styled.Content>
  );
};

export default memo(PassengerAlert);
