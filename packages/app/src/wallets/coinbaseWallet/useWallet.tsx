import {useEffect, useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {WalletLinkConnector} from '@web3-react/walletlink-connector';

import {UseWalletType} from 'wallets';

export const useWallet: UseWalletType = ({appVariables}) => {
  const {library, account, activate, deactivate, active} = useWeb3React();
  console.log('CoinbaseWallet useWallet', {library, account, activate, active});

  const {ethereum} = window as any;
  const isInstalled =
    ethereum?.isCoinbaseWallet || !!ethereum?.providers?.some((p: any) => p.isCoinbaseWallet);

  const signChallenge = useCallback(
    async (challenge: string) => {
      console.log('CoinbaseWallet useWallet connect', challenge);
      const signature = await library.getSigner(account).signMessage(challenge);
      return signature;
    },
    [account, library]
  );

  useEffect(() => {
    console.log('CoinbaseWallet useWallet activate', appVariables.WEB3_PUBLIC_RPC_URL_MAINNET);

    const connector = new WalletLinkConnector({
      // url: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
      url: appVariables.WEB3_PUBLIC_RPC_URL_MAINNET,
      appName: 'Odyssey App',
      supportedChainIds: [1, 3, 4, 5, 42]
    });

    activate(connector)
      .then((res) => {
        console.log('CoinbaseWallet useWallet activated res', res);
      })
      .catch((err) => {
        console.log('CoinbaseWallet useWallet activate err', err);
      });

    return () => {
      console.log('CoinbaseWallet useWallet deactivate');
      deactivate();
    };
  }, [activate, deactivate, appVariables]);

  return {account, accountHex: account, isInstalled, signChallenge};
};
