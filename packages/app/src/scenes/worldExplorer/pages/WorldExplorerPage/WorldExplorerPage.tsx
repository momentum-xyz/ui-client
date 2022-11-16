import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import background from 'static/images/dummy-universe-map.png';
import {useStore} from 'shared/hooks';

import * as styled from './WorldExplorerPage.styled';
import {ExplorePanel} from './components';

const WorldExplorerPage: FC = () => {
  const {worldExplorerStore} = useStore();
  const {addresses, tokenSymbol, isLoading, isWeb3Injected, controllerAccount} =
    worldExplorerStore.polkadotNftStore;
  console.log('Render WorldExplorerPage', {
    addresses,
    tokenSymbol,
    isLoading,
    isWeb3Injected,
    controllerAccount
  });
  useEffect(() => {
    worldExplorerStore.init();
  }, [worldExplorerStore]);
  return (
    <styled.WorldExplorerPageContainer background={background}>
      <ExplorePanel />
    </styled.WorldExplorerPageContainer>
  );
};

export default observer(WorldExplorerPage);
