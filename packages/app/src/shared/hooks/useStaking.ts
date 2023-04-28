import {useCallback, useMemo} from 'react';
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';
import BN from 'bn.js';

import {appVariables} from 'api/constants';

import stackingABI from './contract_staking.ABI.json';
import momABI from './contract_MOM.ABI.json';

enum TokenEnum {
  MOM_TOKEN = 0,
  DAD_TOKEN = 1
}

export const useStaking = () => {
  const {library, account, activate, active} = useWeb3React();
  // const [balance, setBalance] = useState(0);

  console.log('useStaking', {library, account, activate, active});

  const [, stakingContract, momContract] = useMemo(() => {
    if (!library) {
      return [null];
    }
    const web3 = new Web3(library.provider);
    const stakingContract = new web3.eth.Contract(
      stackingABI as any,
      appVariables.CONTRACT_STAKING_ADDRESS
    );
    const momContract = new web3.eth.Contract(momABI as any, appVariables.CONTRACT_MOM_ADDRESS);

    return [web3, stakingContract, momContract];
  }, [library]);

  // useEffect(() => {
  //   if (!web3 || !account) {
  //     return;
  //   }

  //   console.log('useStaking getBalance');
  //   web3.eth
  //     .getBalance(account)
  //     .then((balance) => {
  //       console.log('useStaking balance', balance);
  //       setBalance(+balance);
  //     })
  //     .catch((err) => {
  //       console.log('useStaking getBalance err', err);
  //     });
  //   console.log('useStaking getBalance ret', ret);
  // }, [web3, account]);

  const stake = useCallback(
    async (worldId: string, amount: BN, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useStaking stake');
      const res = await momContract?.methods
        .approve(appVariables.CONTRACT_STAKING_ADDRESS, amount)
        .send({from: account});
      console.log('useStaking stake approve result', res);

      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useStaking stake into nftId', nftId, amount, tokenKind);
      const result = await stakingContract?.methods
        .stake(nftId, amount, tokenKind)
        .send({from: account});
      console.log('useStaking stake result', result);
    },
    [momContract?.methods, account, stakingContract?.methods]
  );

  const unstake = useCallback(
    async (worldId: string, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useStaking unstake');
      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useStaking unstake from nftId', nftId, tokenKind);
      const result = await stakingContract?.methods.unstake(nftId, tokenKind).send({from: account});
      console.log('useStaking unstake result', result);
    },
    [account, stakingContract?.methods]
  );

  const claimRewards = useCallback(async () => {
    console.log('useStaking claimRewards');
    const result = await stakingContract?.methods.claim_rewards().send({from: account});
    console.log('useStaking claimRewards result', result);
  }, [stakingContract?.methods, account]);

  return {isWalletActive: !!library, account, stake, unstake, claimRewards};
};
