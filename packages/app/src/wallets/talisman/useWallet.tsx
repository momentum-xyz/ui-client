import {web3Enable, web3Accounts, web3FromSource} from '@polkadot/extension-dapp';
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {useEffect, useState} from 'react';
import {UseWalletType} from 'wallets/wallets.types';
import {decodeAddress} from '@polkadot/util-crypto';
import {stringToHex, u8aToHex} from '@polkadot/util';
import {hexlify} from '@ethersproject/bytes';
import {toUtf8Bytes} from '@ethersproject/strings';

const isPolkadotAccount = (account: InjectedAccountWithMeta) => {
  try {
    // decodeAddress(account.address);
    // const isPolkadot = account.address.length > 42;
    const isPolkadot = account.type === 'sr25519';
    console.log('isPolkadotAccount', {account, isPolkadot});
    return isPolkadot;
  } catch (e) {
    return false;
  }
};

export const useWallet: UseWalletType = ({appVariables}) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [_selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const selectedAccount = accounts.find((account) => account.address === _selectedAccount);
  console.log('useWallet', {accounts, selectedAccount});

  useEffect(() => {
    const enable = async () => {
      console.log('web3Enable start');
      await web3Enable(appVariables.POLKADOT_CONNECTION_STRING);
      console.log('web3Enable done');
      const allAccounts = await web3Accounts();
      console.log('allAccounts', allAccounts);
      setAccounts(allAccounts);
    };

    enable();
  }, [appVariables]);

  const signChallenge = async (challenge: string): Promise<string> => {
    if (!selectedAccount) {
      throw new Error('No account selected');
    }

    // const isPolkadot = selectedAccount.address.length > 42;

    console.log('signChallenge', {challenge, selectedAccount});
    let signature = '';
    if (isPolkadotAccount(selectedAccount)) {
      const injector = await web3FromSource(selectedAccount.meta?.source || '');
      const signRaw = injector?.signer?.signRaw;
      if (!signRaw) {
        throw new Error('No signRaw method');
      }

      const res = await signRaw({
        address: selectedAccount.address,
        data: stringToHex(challenge),
        type: 'bytes'
      });
      signature = res.signature;
    } else {
      // ethereum
      const provider = (window as any).ethereum;
      signature = await provider.request({
        method: 'personal_sign',
        params: [hexlify(toUtf8Bytes(challenge)), selectedAccount.address]
      });
    }

    return signature;
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  const account = selectedAccount?.address;
  const accountHex =
    selectedAccount && isPolkadotAccount(selectedAccount)
      ? u8aToHex(decodeAddress(account))
      : account;
  console.log('useWallet talisman', {account, accountHex});

  const content = (
    <div style={{padding: '1em'}}>
      {accounts ? (
        <select value={selectedAccount?.address ?? ''} onChange={handleAccountChange}>
          <option value="">Select account</option>
          {accounts.map(({address, meta}) => (
            <option key={address} value={address}>
              {meta.name || address}
            </option>
          ))}
        </select>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );

  return {
    account,
    accountHex,
    content,
    signChallenge
  };
};