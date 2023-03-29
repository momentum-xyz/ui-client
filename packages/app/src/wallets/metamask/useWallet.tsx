import {useEffect, useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {InjectedConnector} from '@web3-react/injected-connector';

import {UseWalletType} from 'wallets';

const connector = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

export const useWallet: UseWalletType = () => {
  const {library, account, activate, deactivate, active} = useWeb3React();
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
      deactivate();
    };
  }, [activate, deactivate]);

  return {account, accountHex: account, signChallenge};
};
