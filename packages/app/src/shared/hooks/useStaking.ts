import {useCallback, useEffect, useMemo, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';
import BN from 'bn.js';

import abi from '../../staking_abi.json';

// const L2_STAKING = '0xC9D24EC9FFe8015430cb503a3aB8B4f24183c5aa';
const L2_STAKING = '0xB51b7639e37150C8924d1Ee35bd3f338C8C9F89c';

export const useStaking = () => {
  const {library, account, activate, active} = useWeb3React();
  const [balanse, setBalanse] = useState(0);

  console.log('StakingOverviewWidget', {library, account, activate, active});

  const [web3, contract] = useMemo(() => {
    if (!library) {
      return [null, null];
    }
    const web3 = new Web3(library.provider);
    const contract = new web3.eth.Contract(abi as any, L2_STAKING);

    return [web3, contract];
  }, [library]);

  useEffect(() => {
    if (!web3 || !account) {
      return;
    }

    console.log('StakingOverviewWidget getBalance');
    const ret = web3.eth.getBalance(account, (err, balance) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('StakingOverviewWidget balance', balance);
      setBalanse(+balance);
    });
    console.log('StakingOverviewWidget getBalance ret', ret);
    // TODO how to unsubscribe?
  }, [web3, account]);

  const stake = useCallback(
    async (worldId: string, amount: BN) => {
      console.log('StakingOverviewWidget stake');
      const result = await contract?.methods.stake(worldId, amount, 0).send({from: account});
      console.log('StakingOverviewWidget stake result', result);
    },
    [contract, account]
  );

  const unstake = () => {
    console.log('TODO StakingOverviewWidget unstake');
  };

  return {isWalletActive: !!library, account, balanse, stake, unstake};
};
