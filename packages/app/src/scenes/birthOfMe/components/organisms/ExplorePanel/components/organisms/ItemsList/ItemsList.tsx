import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {SpaceListItem} from 'ui-kit';
// import {SpaceListByCategoryModelInterface} from 'scenes/home/stores/HomeStore/models';

import * as styled from './ItemsList.styled';

export interface ItemInterface {
  id: string | number;
  name: string;
  image: string;
}

interface PropsInterface {
  items: ItemInterface[];
  onTeleport: (spaceId: string) => void;
  onSelect: (spaceId: string) => void;
}

const ItemsList: FC<PropsInterface> = (props) => {
  const {items, onTeleport, onSelect} = props;
  console.log('Render items list', items);
  return (
    <styled.Container data-testid="SpaceList-test">
      {items.map(({id, name}) => (
        <SpaceListItem
          key={id}
          // TODO: make reusable component
          spaceInfo={{id: String(id), name, hasSubspaces: false}}
          isFavorite={false}
          onTeleportToSpace={onTeleport}
          onSelectSpace={onSelect}
        />
      ))}
    </styled.Container>
  );
};

export default observer(ItemsList);
