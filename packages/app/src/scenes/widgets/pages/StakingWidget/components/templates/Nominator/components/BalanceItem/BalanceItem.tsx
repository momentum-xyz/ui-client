import React, {FC} from 'react';
import {useTheme} from 'styled-components';
import {Heading, Text} from '@momentum-xyz/ui-kit';

import * as styled from './BalanceItem.styled';

interface PropsInterface {
  label: string;
  value: string;
  usd?: string;
}

export const BalanceItem: FC<PropsInterface> = ({label, value, usd = ''}) => {
  const theme = useTheme();
  return (
    <styled.BalanceItem theme={theme}>
      <Heading type="h4" align="left" weight="bold" label={label} />
      <Text text={`${value}`} size="xs" align="left" />
      {usd && (
        <styled.Usd>
          <Text text={usd} size="xs" align="left" />
        </styled.Usd>
      )}
    </styled.BalanceItem>
  );
};
