import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {UniverseMap3d} from './components';

const Map3dPage: FC = () => {
  const {nftStore} = useStore().authStore;

  useEffect(() => {
    // we need this??
    nftStore.init();
  }, [nftStore]);

  return <UniverseMap3d items={nftStore.nftItems} />;
};

export default observer(Map3dPage);
