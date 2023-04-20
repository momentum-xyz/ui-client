import {useCallback, useMemo} from 'react';
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';
import BN from 'bn.js';

import abi from '../../staking_abi.json';

// const L2_STAKING = '0xC9D24EC9FFe8015430cb503a3aB8B4f24183c5aa';
const L2_STAKING = '0xB51b7639e37150C8924d1Ee35bd3f338C8C9F89c';

enum TokenEnum {
  MOM_TOKEN = 0,
  DAD_TOKEN = 1
}

export const useStaking = () => {
  const {library, account, activate, active} = useWeb3React();
  // const [balance, setBalance] = useState(0);

  console.log('StakingOverviewWidget', {library, account, activate, active});

  const [, contract] = useMemo(() => {
    if (!library) {
      return [null, null];
    }
    const web3 = new Web3(library.provider);
    const contract = new web3.eth.Contract(abi as any, L2_STAKING);

    return [web3, contract];
  }, [library]);

  // useEffect(() => {
  //   if (!web3 || !account) {
  //     return;
  //   }

  //   console.log('StakingOverviewWidget getBalance');
  //   web3.eth
  //     .getBalance(account)
  //     .then((balance) => {
  //       console.log('StakingOverviewWidget balance', balance);
  //       setBalance(+balance);
  //     })
  //     .catch((err) => {
  //       console.log('StakingOverviewWidget getBalance err', err);
  //     });
  //   console.log('StakingOverviewWidget getBalance ret', ret);
  // }, [web3, account]);

  const stake = useCallback(
    async (worldId: string, amount: BN, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('StakingOverviewWidget stake');
      const result = await contract?.methods
        .stake(worldId, amount, tokenKind)
        .send({from: account});
      console.log('StakingOverviewWidget stake result', result);
    },
    [contract, account]
  );

  const unstake = () => {
    console.log('TODO StakingOverviewWidget unstake');
  };

  return {isWalletActive: !!library, account, stake, unstake};
};
