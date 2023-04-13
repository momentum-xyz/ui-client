import {FC, memo} from 'react';
import {NumericFormat, NumericFormatProps} from 'react-number-format';

import * as styled from './SymbolAmount.styled';

export interface SymbolAmountPropsInterface {
  value?: number | null;
  tokenSymbol?: string | null;
  decimalScale?: number;
}

const FORMATTING: NumericFormatProps = {
  displayType: 'text',
  decimalSeparator: '.',
  thousandSeparator: ' '
};

const SymbolAmount: FC<SymbolAmountPropsInterface> = (props) => {
  const {value, tokenSymbol, decimalScale = 3} = props;

  return (
    <styled.ItemValue data-testid="SymbolAmount-test">
      <NumericFormat {...FORMATTING} decimalScale={decimalScale} value={value} />
      {!!tokenSymbol && <styled.ItemSuffix>{tokenSymbol}</styled.ItemSuffix>}
    </styled.ItemValue>
  );
};

export default memo(SymbolAmount);
