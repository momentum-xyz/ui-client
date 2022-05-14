import {BN, BN_ZERO} from '@polkadot/util';
import {DeriveStakingAccount} from '@polkadot/api-derive/staking/types';

export const calcUnbonding = (stakingInfo: DeriveStakingAccount) => {
  if (!stakingInfo?.unlocking) {
    return BN_ZERO;
  }

  const filtered = stakingInfo.unlocking
    .filter(({remainingEras, value}) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
    .map((unlock) => unlock.value);
  return filtered.reduce((total, value) => total.iadd(value), new BN(0));
};
