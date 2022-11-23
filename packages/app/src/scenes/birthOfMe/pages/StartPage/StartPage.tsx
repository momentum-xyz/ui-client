import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import * as styled from './StartPage.styled';
import {ExplorePanel, UniverseMap} from './components';

const StartPage: FC = () => {
  const {birthOfMeStore} = useStore();
  const {nftStore} = birthOfMeStore;
  const {nftItems, addresses, tokenSymbol, isLoading, isWeb3Injected, controllerAccount} = nftStore;

  useEffect(() => {
    birthOfMeStore.init();
  }, [birthOfMeStore]);

  console.log('Render WorldExplorerPage', {
    addresses,
    tokenSymbol,
    isLoading,
    isWeb3Injected,
    controllerAccount
  });

  return (
    <styled.WorldExplorerPageContainer>
      <styled.UniverseContainer>
        <UniverseMap items={nftItems} />
      </styled.UniverseContainer>
      <styled.InnerContainer>
        <ExplorePanel />
      </styled.InnerContainer>
    </styled.WorldExplorerPageContainer>
  );
};

export default observer(StartPage);
