import React, {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {Dropdown, OptionInterface, PropsWithThemeInterface} from 'ui-kit';

import * as styled from './AccountPicker.styled';

interface PropsInterface extends PropsWithThemeInterface {
  selectedAccount?: string | null;
  accountList: InjectedAccountWithMeta[];
  onSelect: (address: string) => void;
}

const AccountPicker: FC<PropsInterface> = (props) => {
  const {selectedAccount, accountList, onSelect, theme} = props;

  const {t} = useTranslation();

  const accountOptions = useMemo((): OptionInterface[] => {
    return accountList.map((account) => ({
      label: account.meta.name || account.address,
      value: account.address,
      icon: 'polkadotprofile'
    }));
  }, [accountList]);

  return (
    <styled.Wrapper>
      <Dropdown
        theme={theme}
        variant="secondary"
        placeholder={t('actions.selectAccount')}
        value={selectedAccount}
        valueType="wallet"
        options={accountOptions}
        onOptionSelect={(option) => onSelect(option.value)}
      />
    </styled.Wrapper>
  );
};
export default observer(AccountPicker);
