import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './WorldExplorerPage.styled';
import {ExplorePanel, UniverseMap} from './components';

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
  const {items} = worldExplorerStore;

  useEffect(() => {
    worldExplorerStore.init();
  }, [worldExplorerStore]);

  return (
    <styled.WorldExplorerPageContainer>
      <styled.UniverseContainer>
        <UniverseMap items={items} />
      </styled.UniverseContainer>
      <styled.InnerContainer>
        <ExplorePanel />
      </styled.InnerContainer>
    </styled.WorldExplorerPageContainer>
  );
};

export default observer(WorldExplorerPage);
