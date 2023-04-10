import {useEffect, useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {InjectedConnector} from '@web3-react/injected-connector';

import {UseWalletType} from 'wallets';

const ARBITRUM_ONE = 42161;
const OPTIMISM = 10;
const ARBITRUM_NITRO = 421611;
const LOCAL_TESTNET = 1337;
const LOCAL_TESTNET_ARBITRUM = 412346;

const connector = new InjectedConnector({
  supportedChainIds: [
    1,
    3,
    4,
    5,
    42,
    ARBITRUM_ONE,
    ARBITRUM_NITRO,
    OPTIMISM,
    LOCAL_TESTNET,
    LOCAL_TESTNET_ARBITRUM
  ]
});

const {ethereum} = window as any;
// this structure exists when Coinbase Wallet is installed
const metamaskProvider = ethereum?.providers?.find((p: any) => p.isMetaMask);

export const useWallet: UseWalletType = () => {
  // const {library, account, activate, deactivate, active} = useWeb3React();
  const data = useWeb3React();
  const {library, account, activate, active} = data;
  console.log('useWallet', {library, account, activate, active});

  const signChallenge = useCallback(
    async (challenge: string) => {
      console.log('useWallet connect', challenge);
      const signature = await library.getSigner(account).signMessage(challenge);
      return signature;
    },
    [account, library]
  );

  useEffect(() => {
    console.log('MetaMask useWallet activate');
    console.log('MetaMask useWallet metamaskProvider', metamaskProvider);

    // It's a workaround to fix the issue with opening Coinbase Wallet when it's also installed
    if (metamaskProvider && typeof ethereum.selectedProvider !== 'undefined') {
      try {
        ethereum.selectedProvider = metamaskProvider;
      } catch (err) {
        console.log('MetaMask useWallet selectedProvider err', err);
      }
    }

    // connector.activate()
    activate(connector)
      .then((res) => {
        console.log('MetaMask useWallet activated res', res);
      })
      .catch((err) => {
        console.log('MetaMask useWallet activate err', err);
      });

    return () => {
      console.log('MetaMask useWallet deactivate');
      // deactivate();
    };
  }, [activate]);
  // }, [activate, deactivate]);

  return {account, accountHex: account, signChallenge};
};
