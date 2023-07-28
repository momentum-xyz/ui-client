// import {web3Enable, web3Accounts, web3FromSource} from '@polkadot/extension-dapp';
// import type {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';
import {
  useCallback,
  useEffect
  //  useState
} from 'react';
// import {decodeAddress} from '@polkadot/util-crypto';
// import {stringToHex, u8aToHex} from '@polkadot/util';
// import {hexlify} from '@ethersproject/bytes';
// import {toUtf8Bytes} from '@ethersproject/strings';
import {useWeb3React} from '@web3-react/core';
import {useMutableCallback} from '@momentum-xyz/ui-kit';

import {UseWalletType} from 'wallets';
import {SUPPORTED_CHAIN_IDS} from 'wallets/supportedChainIds';

import {TalismanConnector} from './TalismanConnector';

const talismanConnector = new TalismanConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
});

// const isPolkadotAccount = (account: InjectedAccountWithMeta) => {
//   try {
//     // decodeAddress(account.address);
//     // const isPolkadot = account.address.length > 42;
//     const isPolkadot = account.type === 'sr25519';
//     console.log('isPolkadotAccount', {account, isPolkadot});
//     return isPolkadot;
//   } catch (e) {
//     return false;
//   }
// };

export const useWallet: UseWalletType = ({appVariables, onActivationDone}) => {
  const {library, chainId, account, activate, deactivate, active} = useWeb3React();
  console.log('Talisman useWallet', {library, account, activate, active});

  // const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  // const [_selectedAccount, setSelectedAccount] = useState<string | null>(null);
  // const selectedAccount = accounts.find((account) => account.address === _selectedAccount);
  // console.log('Talisman useWallet', {accounts, selectedAccount});

  const talismanEth = (window as any)?.talismanEth;
  const isInstalled = !!talismanEth;

  const onActivationDoneCallback = useMutableCallback(onActivationDone);

  const activateWallet = useCallback(async () => {
    // const enable = async () => {
    //   console.log('web3Enable start');
    //   await web3Enable(appVariables.POLKADOT_CONNECTION_STRING);
    //   console.log('web3Enable done');
    //   const allAccounts = await web3Accounts();
    //   console.log('allAccounts', allAccounts);
    //   setAccounts(allAccounts);
    // };

    // enable();

    return new Promise<void>((resolve, reject) => {
      // another workaround for Coinbase Wallet
      // when swtiching from Coinbase Wallet to MetaMask there's some internal race condition
      // that leaves connector deactivated so timeout helps here
      // https://github.com/Uniswap/web3-react/issues/78
      setTimeout(() => {
        activate(talismanConnector)
          .then((res) => {
            console.log('Talisman useWallet activated res', res);
            onActivationDoneCallback(true);
            resolve();
            // talismanEth
            //   .request({method: 'eth_requestAccounts'})
            //   .then((res: any) => {
            //     console.log('Talisman useWallet eth_requestAccounts res', res);
            //   })
            //   .catch((err: any) => {
            //     console.log('Talisman useWallet eth_requestAccounts err', err);
            //   });
          })
          .catch((err) => {
            console.log('Talisman useWallet activate err', err);
            onActivationDoneCallback(false);
            reject(err);
          });
      }, 500);
    });
  }, [activate, onActivationDoneCallback]);

  useEffect(() => {
    if (!isInstalled) {
      console.log('Talisman Wallet is not installed');
      return;
    }

    activateWallet();

    return () => {
      deactivate();
    };
  }, [activateWallet, deactivate, isInstalled]);

  const signChallenge = useCallback(
    async (challenge: string) => {
      console.log('Talisman useWallet connect', challenge);
      const signature = await library.getSigner(account).signMessage(challenge);
      return signature;
    },
    [account, library]
  );

  // const signChallenge = async (challenge: string): Promise<string> => {
  //   if (!selectedAccount) {
  //     throw new Error('No account selected');
  //   }

  //   // const isPolkadot = selectedAccount.address.length > 42;

  //   console.log('signChallenge', {challenge, selectedAccount});
  //   let signature = '';
  //   if (isPolkadotAccount(selectedAccount)) {
  //     const injector = await web3FromSource(selectedAccount.meta?.source || '');
  //     const signRaw = injector?.signer?.signRaw;
  //     if (!signRaw) {
  //       throw new Error('No signRaw method');
  //     }

  //     const res = await signRaw({
  //       address: selectedAccount.address,
  //       data: stringToHex(challenge),
  //       type: 'bytes'
  //     });
  //     signature = res.signature;
  //   } else {
  //     // ethereum
  //     const provider = (window as any).ethereum;
  //     signature = await provider.request({
  //       method: 'personal_sign',
  //       params: [hexlify(toUtf8Bytes(challenge)), selectedAccount.address]
  //     });
  //   }

  //   return signature;
  // };

  // const handleAccountChange = (value: string | null) => {
  //   if (!value) {
  //     return;
  //   }
  //   setSelectedAccount(value);
  // };

  // const account = selectedAccount?.address;
  const accountHex = account;
  // const accountHex =
  //   selectedAccount && isPolkadotAccount(selectedAccount)
  //     ? u8aToHex(decodeAddress(account))
  //     : account;
  console.log('useWallet talisman', {account, accountHex});

  // const options = accounts.map(({address, meta}) => ({
  //   label: meta.name || address,
  //   value: address
  // }));
  // const content = (
  //   <>
  //     {accounts ? (
  //       <Select
  //         options={options}
  //         value={null}
  //         onSingleChange={handleAccountChange}
  //         hideSelectedOptions={false}
  //       ></Select>
  //     ) : (
  //       <span>Loading...</span>
  //     )}
  //   </>
  // );

  return {
    account,
    accountHex,
    isInstalled,
    activate: activateWallet,
    isActive: active,
    // content,
    web3Library: library,
    chainId,
    signChallenge
  };
};
