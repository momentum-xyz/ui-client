import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {UniverseMap3D} from './components';
//import * as styled from './UniverseMapPage.styled';

const UniverseMapPage: FC = () => {
  const {birthOfMeStore} = useStore();
  const {nftStore} = birthOfMeStore;
  const {nftItems, addresses, tokenSymbol, isLoading, isWeb3Injected, controllerAccount} = nftStore;

  useEffect(() => {
    nftStore.init();
  }, [nftStore]);

  console.log('Render WorldExplorerPage', {
    addresses,
    tokenSymbol,
    isLoading,
    isWeb3Injected,
    controllerAccount
  });

  /*return (
    <styled.WorldExplorerPageContainer>
      <styled.UniverseContainer>
        <UniverseMap3D items={nftItems} />
      </styled.UniverseContainer>
    </styled.WorldExplorerPageContainer>
  );*/

  return (
    <>
      <UniverseMap3D items={nftItems} />
    </>
  );
};

export default observer(UniverseMapPage);
