import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
import {Button} from '@momentum-xyz/ui-kit';
import {BN} from 'bn.js';

import {useStaking} from 'shared/hooks';

import {SignIn} from '../LoginWidget/components';

const StakingContractsTestWidget: FC = () => {
  const {isWalletActive, account, stake} = useStaking();
  console.log('StakingOverviewWidget', {isWalletActive, account, stake});

  return (
    <div>
      <Panel variant="primary" size="normal" title="Staking TEST" icon="stake">
        {!isWalletActive && (
          <SignIn
            onConnected={() => {
              console.log('Wallet connected');
            }}
          />
        )}
        {isWalletActive && (
          <div>
            <Button
              label="Stake"
              onClick={() => stake('0x98e3a28d007d404bb370902d38032027', new BN(1_000_000_042))}
            />
          </div>
        )}
      </Panel>
    </div>
  );
};

export default observer(StakingContractsTestWidget);
