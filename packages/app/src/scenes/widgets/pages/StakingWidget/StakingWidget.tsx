import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';

import {WidgetEnum} from 'core/enums';
import {useStore} from 'shared/hooks';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import * as styled from './StakingWidget.styled';
import {StakingForm} from './components';

const StakingWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, sessionStore, nftStore, universeStore} = useStore();
  const {close} = widgetManagerStore;

  const nftId = data?.id || universeStore.worldId;

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
          key={nftStore.selectedWalletId}
          isGuest={sessionStore.isGuest}
          nftItemId={nftId}
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
