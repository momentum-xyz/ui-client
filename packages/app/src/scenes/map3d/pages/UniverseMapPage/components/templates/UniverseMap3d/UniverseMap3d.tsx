import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {NftItemInterface} from 'stores/NftStore/models';

import * as styled from './UniverseMap3d.styled';

// TODO: Adapt to React
import './Map3D.ts';

interface PropsInterface {
  items: NftItemInterface[];
}

const UniverseMap3d: FC<PropsInterface> = () => {
  return <styled.UniverseMap />;
};

export default observer(UniverseMap3d);
