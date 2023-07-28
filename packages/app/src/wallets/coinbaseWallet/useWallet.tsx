import {useEffect, useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {WalletLinkConnector} from '@web3-react/walletlink-connector';
import {useMutableCallback} from '@momentum-xyz/ui-kit';

import {UseWalletType} from 'wallets';
import {SUPPORTED_CHAIN_IDS} from 'wallets/supportedChainIds';

export const useWallet: UseWalletType = ({appVariables, onActivationDone}) => {
  const {library, chainId, account, activate, deactivate, active} = useWeb3React();
  console.log('CoinbaseWallet useWallet', {library, account, activate, active});

  const {ethereum} = window as any;
  const isInstalled =
    ethereum?.isCoinbaseWallet || !!ethereum?.providers?.some((p: any) => p.isCoinbaseWallet);

  const onActivationDoneCallback = useMutableCallback(onActivationDone);

  const activateWallet = useCallback(async () => {
    console.log('CoinbaseWallet useWallet activate', appVariables.WEB3_PUBLIC_RPC_URL_MAINNET);

    const connector = new WalletLinkConnector({
      // url: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
      url: appVariables.WEB3_PUBLIC_RPC_URL_MAINNET,
      appName: 'Odyssey App',
      supportedChainIds: SUPPORTED_CHAIN_IDS
    });

    return activate(connector)
      .then((res) => {
        console.log('CoinbaseWallet useWallet activated res', res);
        onActivationDoneCallback(true);
      })
      .catch((err) => {
        console.log('CoinbaseWallet useWallet activate err', err);
        onActivationDoneCallback(false);
      });
  }, [activate, appVariables, onActivationDoneCallback]);

  const signChallenge = useCallback(
    async (challenge: string) => {
      console.log('CoinbaseWallet useWallet connect', challenge);
      const signature = await library.getSigner(account).signMessage(challenge);
      return signature;
    },
    [account, library]
  );

  useEffect(() => {
    if (!isInstalled) {
      console.log('CoinbaseWallet useWallet not installed');
      return;
    }

    activateWallet();

    return () => {
      console.log('CoinbaseWallet useWallet deactivate');
      deactivate();
    };
  }, [activateWallet, deactivate, isInstalled]);

  return {
    account,
    accountHex: account,
    isInstalled,
    activate: activateWallet,
    isActive: active,
    web3Library: library,
    chainId,
    signChallenge
  };
};
