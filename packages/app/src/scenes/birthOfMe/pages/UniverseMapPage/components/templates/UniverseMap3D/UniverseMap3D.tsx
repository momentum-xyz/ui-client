import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {NftItemInterface} from '../../../../../stores/NftStore/models';

import * as styled from './UniverseMap3D.styled';

// TODO: Adapt to React
import './Map3D.ts';

interface PropsInterface {
  items: NftItemInterface[];
}

const UniverseMap3D: FC<PropsInterface> = () => {
  return <styled.UniverseMap />;
};

export default observer(UniverseMap3D);
