import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {WorldInfoInterface} from '../../../../../stores/StartStore';

import * as styled from './UniverseMap3D.styled';

import './Map3D.ts';

interface PropsInterface {
  items: WorldInfoInterface[];
}

const UniverseMap3D: FC<PropsInterface> = () => {
  return <styled.UniverseMap></styled.UniverseMap>;
};

export default observer(UniverseMap3D);
