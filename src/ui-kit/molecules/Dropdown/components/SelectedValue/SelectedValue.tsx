import React, {FC, useCallback} from 'react';

import {IconSvg} from 'ui-kit';
import {ValueType} from 'ui-kit/types';
import {PropsWithThemeInterface, OptionInterface} from 'ui-kit/interfaces';

import * as styled from './SelectedValue.styled';

interface PropsInterface extends PropsWithThemeInterface {
  placeholder: string;
  valueType: ValueType;
  selected?: OptionInterface;
}

const SelectedValue: FC<PropsInterface> = (props) => {
  const {placeholder, selected, valueType} = props;

  const formatWalletValue = useCallback((wallet: string) => {
    return `${wallet.substring(0, 10)}....${wallet.slice(-10)}`;
  }, []);

  return (
    <styled.Container>
      {!selected && <styled.Placeholder>{placeholder}</styled.Placeholder>}
      {!!selected && valueType === 'string' && <styled.Value>{selected.label}</styled.Value>}
      {!!selected && valueType === 'wallet' && (
        <styled.WalletValue>
          <styled.WalletIcon>
            {selected.icon && <IconSvg name={selected.icon} size="normal" />}
            <span>{selected.label}</span>
          </styled.WalletIcon>
          <styled.Wallet>{formatWalletValue(selected.value)}</styled.Wallet>
        </styled.WalletValue>
      )}
    </styled.Container>
  );
};

export default SelectedValue;
