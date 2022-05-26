import React from 'react';
import {useTheme} from 'styled-components';

import {Heading, Text} from 'ui-kit';

import * as styled from './BalanceItem.styled';

type BalanceItemProps = {
  label: string;
  value: string;
  usd?: string;
};

export const BalanceItem = ({label, value, usd = ''}: BalanceItemProps) => {
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
