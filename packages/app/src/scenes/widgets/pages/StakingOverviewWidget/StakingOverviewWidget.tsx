import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Hexagon, Panel} from '@momentum-xyz/ui-kit-storybook';

const StakingOverviewWidget: FC = () => {
  return (
    <div>
      <Panel
        variant="primary"
        title="Staking Overview"
        hexagon={<Hexagon type="secondary-borderless" iconName="planet" />}
      >
        DATA
      </Panel>
    </div>
  );
};

export default observer(StakingOverviewWidget);
