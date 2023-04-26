import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';

import {WidgetEnum} from 'core/enums';
import {useStore} from 'shared/hooks';

import * as styled from './StakingWidget.styled';
import {StakingForm} from './components';

const StakingWidget: FC = () => {
  const {widgetManagerStore, sessionStore, nftStore, universeStore} = useStore();
  const {close} = widgetManagerStore;

  const worldId = universeStore.worldId;

  const handleOnClose = () => {
    nftStore.setConnectToNftItemId(null); // TODO
    close(WidgetEnum.STAKING);
  };

  return (
    <Panel
      isFullHeight
      size="large"
      icon="stake"
      variant="primary"
      title="Staking"
      onClose={handleOnClose}
    >
      <styled.FullSizeWrapper>
        <StakingForm
          isGuest={sessionStore.isGuest}
          nftItemId={worldId}
          onComplete={() => {
            // need toast here ???
            handleOnClose();
          }}
        />
      </styled.FullSizeWrapper>
    </Panel>
  );
};

export default observer(StakingWidget);
