import {useEffect, useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {InjectedConnector} from '@web3-react/injected-connector';

import {UseWalletType} from 'wallets';

const connector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

export const useWallet: UseWalletType = () => {
  const {library, account, activate, deactivate, active} = useWeb3React();
  console.log('MetaMask useWallet', {library, account, activate, active});

  const {ethereum} = window as any;
  // this structure exists when both Metamask and Coinbase Wallet are installed
  const metamaskProvider = ethereum?.providers?.find((p: any) => p.isMetaMask);
  const isInstalled = !!metamaskProvider || ethereum?.isMetaMask;

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
    if (metamaskProvider && typeof ethereum.setSelectedProvider === 'function') {
      try {
        ethereum.setSelectedProvider?.(metamaskProvider);
      } catch (err) {
        console.log('MetaMask useWallet selectedProvider err', err);
      }
    }

    // another workaround for Coinbase Wallet
    // when swtiching from Coinbase Wallet to MetaMask there's some internal race condition
    // that leaves connector deactivated so timeout helps here
    // https://github.com/Uniswap/web3-react/issues/78
    setTimeout(() => {
      activate(connector)
        .then((res) => {
          console.log('MetaMask useWallet activated res', res);
        })
        .catch((err) => {
          console.log('MetaMask useWallet activate err', err);
        });
    }, 500);

    return () => {
      console.log('MetaMask useWallet deactivate');
      deactivate();
    };
  }, [activate, deactivate]);

  return {account, accountHex: account, isInstalled, signChallenge};
};
