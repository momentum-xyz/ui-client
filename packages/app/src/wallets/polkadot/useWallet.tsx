import {web3Enable, web3Accounts, web3FromSource} from '@polkadot/extension-dapp';
import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {useEffect, useState} from 'react';
import {UseWalletType} from 'wallets/wallets.types';
import {decodeAddress} from '@polkadot/util-crypto';
import {stringToHex, u8aToHex} from '@polkadot/util';

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
      setAccounts(allAccounts.filter((account) => account.type === 'sr25519'));
    };

    enable();
  }, [appVariables]);

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

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  const account = selectedAccount?.address;
  const accountHex = account ? u8aToHex(decodeAddress(account)) : null;

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