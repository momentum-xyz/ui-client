import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';

const StakingOverviewWidget: FC = () => {
  return (
    <div>
      <Panel variant="primary" title="Staking Overview" icon="stake">
        DATA
      </Panel>
    </div>
  );
};

export default observer(StakingOverviewWidget);
