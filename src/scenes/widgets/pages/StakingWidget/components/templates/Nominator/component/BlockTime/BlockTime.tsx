import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {BN, formatNumber} from '@polkadot/util';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';

interface PropsInterface {
  blocks: BN;
}

const BlockTime = ({blocks}: PropsInterface) => {
  const {polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {calculateUnlockingDuration, unlockingDuration} = polkadotProviderStore;

  useEffect(() => {
    calculateUnlockingDuration(blocks);
  }, [calculateUnlockingDuration, blocks]);

  return (
    <div>
      {`${t('staking.stakingBlocks', {blocks: formatNumber(blocks)})}, `}
      {unlockingDuration && (
        <>
          {unlockingDuration?.days && <span>{`${unlockingDuration?.days} `}</span>}
          {unlockingDuration?.hours && <span>{`${unlockingDuration?.hours} `}</span>}
          {unlockingDuration?.minutes && <span>{`${unlockingDuration?.minutes} `}</span>}
        </>
      )}
    </div>
  );
};

export default observer(BlockTime);
