import {FC} from 'react';

import astronaut from 'static/images/astronaut.svg';

import {NftItemInterface} from '../../../../../../birthOfMe/stores/NftStore/models';

import * as styled from './UniverseMap.styled';

interface PropsInterface {
  items: NftItemInterface[];
}

export const UniverseMap: FC<PropsInterface> = ({items}) => {
  return (
    <styled.UniverseMapContainer>
      {items.map((item, idx) => (
        <styled.WorldItem key={item.id} x={idx * 10 + 50} y={idx * 10 + 50} size={100}>
          <styled.WorldItemImage src={item.image || astronaut} title={item.name} />
        </styled.WorldItem>
      ))}
    </styled.UniverseMapContainer>
  );
};
