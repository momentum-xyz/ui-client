import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {Text} from 'ui-kit';

import * as styled from './NetworkRemarks.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const NetworkRemarks: FC<PropsInterface> = ({theme}) => {
  const {t} = useTranslation();
  return (
    <styled.Wrapper data-testid="NetworkRemarks-test">
      <styled.Grid>
        <styled.GridItem>
          <Text theme={theme} size="l" text={t('messages.fullyEnjoy')} weight="light" />
        </styled.GridItem>
        <styled.GridItem>
          <Text theme={theme} size="l" text={t('messages.flyAround')} weight="light" />
        </styled.GridItem>
      </styled.Grid>
    </styled.Wrapper>
  );
};
export default NetworkRemarks;
