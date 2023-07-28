import {web3Enable, web3Accounts, web3FromSource, isWeb3Injected} from '@polkadot/extension-dapp';
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {useCallback, useEffect, useState} from 'react';
import {decodeAddress} from '@polkadot/util-crypto';
import {stringToHex, u8aToHex} from '@polkadot/util';
import {Select, useMutableCallback} from '@momentum-xyz/ui-kit';

import {UseWalletType} from 'wallets';

export const useWallet: UseWalletType = ({appVariables, onActivationDone}) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [_selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const selectedAccount = accounts.find((account) => account.address === _selectedAccount);
  console.log('useWallet', {accounts, selectedAccount});

  const isInstalled = !!(window as any)?.injectedWeb3?.['polkadot-js'];

  const onActivationDoneCallback = useMutableCallback(onActivationDone);

  const activate = useCallback(async () => {
    console.log('web3Enable start');
    await web3Enable(appVariables.POLKADOT_CONNECTION_STRING);
    console.log('web3Enable done');
    const allAccounts = await web3Accounts();
    console.log('allAccounts', allAccounts);
    setAccounts(allAccounts.filter((account) => account.type === 'sr25519'));
  }, [appVariables]);

  useEffect(() => {
    if (!isInstalled) {
      console.log('Polkadot.js Wallet is not installed');
      return;
    }

    activate()
      .then(() => onActivationDoneCallback(true))
      .catch((err) => {
        console.log('WalletSelectHelper activate err', err);
        onActivationDone(false);
      });
  }, [activate, isInstalled, onActivationDoneCallback]);

  const signChallenge = async (challenge: string): Promise<string> => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    console.log('signChallenge', {challenge, selectedAccount});

    const injector = await web3FromSource(selectedAccount.meta?.source || '');
    const signRaw = injector?.signer?.signRaw;
    if (!signRaw) {
      throw new Error('No signRaw method');
    }

    const {signature} = await signRaw({
      address: selectedAccount.address,
      data: stringToHex(challenge),
      type: 'bytes'
    });

    return signature;
  };

  const handleAccountChange = (value: string | null) => {
    if (!value) {
      return;
    }
    setSelectedAccount(value);
  };

  const account = selectedAccount?.address;
  const accountHex = account ? u8aToHex(decodeAddress(account)) : null;

  const options = accounts.map(({address, meta}) => ({
    label: meta.name || address,
    value: address
  }));
  const content = (
    <>
      {accounts ? (
        <Select
          options={options}
          value={null}
          onSingleChange={handleAccountChange}
          hideSelectedOptions={false}
          wide
        />
      ) : (
        <span>Loading...</span>
      )}
    </>
  );

  return {
    account,
    accountHex,
    isInstalled,
    activate,
    isActive: isWeb3Injected,
    content,
    signChallenge
  };
};
