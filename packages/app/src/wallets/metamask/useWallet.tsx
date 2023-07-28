import {useEffect, useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {InjectedConnector} from '@web3-react/injected-connector';
import {useMutableCallback} from '@momentum-xyz/ui-kit';

import {UseWalletType} from 'wallets';
import {SUPPORTED_CHAIN_IDS} from 'wallets/supportedChainIds';

const connector = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS
});

export const useWallet: UseWalletType = ({onActivationDone}) => {
  const {library, chainId, account, activate, deactivate, active} = useWeb3React();
  console.log('MetaMask useWallet', {library, account, activate, active});

  const {ethereum} = window as any;
  // this structure exists when both Metamask and Coinbase Wallet are installed
  const metamaskProvider = ethereum?.providers?.find((p: any) => p.isMetaMask && !p.isTalisman);
  const isInstalled = !!metamaskProvider || ethereum?.isMetaMask;
  console.log('MetaMask useWallet metamaskProvider', metamaskProvider);

  const signChallenge = useCallback(
    async (challenge: string) => {
      console.log('useWallet connect', challenge);
      const signature = await library.getSigner(account).signMessage(challenge);
      return signature;
    },
    [account, library]
  );

  const onActivationDoneCallback = useMutableCallback(onActivationDone);

  const activateWallet = useCallback(async () => {
    console.log('MetaMask useWallet activate');

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
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        activate(connector)
          .then((res) => {
            console.log('MetaMask useWallet activated res', res);
            onActivationDoneCallback(true);
            resolve();
          })
          .catch((err) => {
            console.log('MetaMask useWallet activate err', err);
            onActivationDoneCallback(false);
            reject(err);
          });
      }, 500);
    });
  }, [activate, ethereum, metamaskProvider, onActivationDoneCallback]);

  useEffect(() => {
    if (!isInstalled) {
      console.log('MetaMask useWallet not installed');
      return;
    }

    activateWallet();

    return () => {
      console.log('MetaMask useWallet deactivate');
      deactivate();
    };
  }, [activateWallet, deactivate, isInstalled]);

  return {
    account,
    accountHex: account,
    isInstalled,
    web3Library: library,
    chainId,
    activate: activateWallet,
    isActive: active,
    signChallenge
  };
};
