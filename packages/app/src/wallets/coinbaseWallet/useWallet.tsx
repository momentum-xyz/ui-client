import {useEffect, useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {WalletLinkConnector} from '@web3-react/walletlink-connector';
import {UseWalletType} from 'wallets/wallets.types';

// TODO use appVariables
const connector = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
  appName: 'Odyssey App',
  supportedChainIds: [1, 3, 4, 5, 42]
});

export const useWallet: UseWalletType = () => {
  const {library, account, activate, deactivate, active} = useWeb3React();
  console.log('CoinbaseWallet useWallet', {library, account, activate, active});

  const signChallenge = useCallback(
    async (challenge: string) => {
      console.log('CoinbaseWallet useWallet connect', challenge);
      const signature = await library.getSigner(account).signMessage(challenge);
      return signature;
    },
    [account, library]
  );

  useEffect(() => {
    console.log('CoinbaseWallet useWallet activate');
    // connector.activate()
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
  }, [activate, deactivate]);

  return {account, accountHex: account, signChallenge};
};
