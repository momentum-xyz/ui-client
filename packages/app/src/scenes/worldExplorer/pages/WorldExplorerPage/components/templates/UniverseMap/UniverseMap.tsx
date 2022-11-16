import {FC} from 'react';

import {WorldInfoInterface} from '../../../../../stores/WorldExplorerStore/models';

import * as styled from './UniverseMap.styled';

interface PropsInterface {
  items: WorldInfoInterface[];
}

export const UniverseMap: FC<PropsInterface> = ({items}) => {
  return (
    <styled.UniverseMapContainer>
      {items.map((item, idx) => (
        <styled.WorldItem key={item.id} x={idx * 10 + 50} y={idx * 10 + 50} size={100}>
          <styled.WorldItemImage src={item.image} />
        </styled.WorldItem>
      ))}
    </styled.UniverseMapContainer>
  );
};
