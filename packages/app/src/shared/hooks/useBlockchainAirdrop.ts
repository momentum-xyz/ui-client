import {useCallback, useMemo} from 'react';
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';

import {appVariables} from 'api/constants';

import faucetABI from './contract_faucet.ABI.json';

enum TokenEnum {
  MOM_TOKEN = 0,
  DAD_TOKEN = 1
}

export const useBlockchainAirdrop = () => {
  const {library, account, activate, active} = useWeb3React();

  console.log('useBlockchainAirdrop', {library, account, activate, active});

  const [, faucetContract] = useMemo(() => {
    if (!library) {
      return [null];
    }
    const web3 = new Web3(library.provider);
    const faucet = new web3.eth.Contract(faucetABI as any, appVariables.CONTRACT_FAUCET_ADDRESS);

    return [web3, faucet];
  }, [library]);

  const getTokens = useCallback(
    async (tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useBlockchainAirdrop getTokens', {tokenKind});
      const result = await faucetContract?.methods.get_tokens(tokenKind).send({from: account});
      console.log('useBlockchainAirdrop getTokens result', result);
    },
    [account, faucetContract?.methods]
  );

  return {isWalletActive: !!library, account, getTokens};
};