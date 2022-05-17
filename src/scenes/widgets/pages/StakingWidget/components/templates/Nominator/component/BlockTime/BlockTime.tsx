import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {BN} from '@polkadot/util';

import {useStore} from 'shared/hooks';

interface PropsInterface {
  blocks: BN;
}

const BlockTime = ({blocks}: PropsInterface) => {
  const {calculateUnlockingDuration, unlockingDuration} =
    useStore().widgetStore.stakingStore.polkadotProviderStore;
  useEffect(() => {
    calculateUnlockingDuration(blocks);
  }, [calculateUnlockingDuration, blocks]);

  console.log(unlockingDuration);

  return (
    <div>
      {unlockingDuration?.split(' ').map((v, index) => (
        <span className={index % 2 ? 'timeUnits' : undefined} key={index}>
          {v}
        </span>
      ))}
    </div>
  );
};

export default observer(BlockTime);
