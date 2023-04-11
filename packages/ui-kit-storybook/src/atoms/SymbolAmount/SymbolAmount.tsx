import {FC, memo} from 'react';
import {NumericFormat, NumericFormatProps} from 'react-number-format';

import * as styled from './SymbolAmount.styled';

export interface SymbolAmountPropsInterface {
  value: number;
  tokenSymbol: string;
}

const FORMATTING: NumericFormatProps = {
  displayType: 'text',
  decimalSeparator: '.',
  thousandSeparator: ' ',
  decimalScale: 3
};

const SymbolAmount: FC<SymbolAmountPropsInterface> = ({value, tokenSymbol}) => {
  return (
    <styled.ItemValue data-testid="SymbolAmount-test">
      <NumericFormat {...FORMATTING} value={value} />
      <styled.ItemSuffix>{tokenSymbol}</styled.ItemSuffix>
    </styled.ItemValue>
  );
};

export default memo(SymbolAmount);
