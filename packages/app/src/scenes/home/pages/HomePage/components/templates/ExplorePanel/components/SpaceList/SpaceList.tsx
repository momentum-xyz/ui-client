import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {SpaceListItem} from 'ui-kit';
import {SpaceListByCategoryModelInterface} from 'scenes/home/stores/HomeStore/models';

import * as styled from './SpaceList.styled';

interface PropsInterface {
  spaceListByCategory: SpaceListByCategoryModelInterface[];
  onTeleportToSpace: (spaceId: string) => void;
  onSelectSpace: (spaceId: string) => void;
}

const SpaceList: FC<PropsInterface> = (props) => {
  const {spaceListByCategory, onTeleportToSpace, onSelectSpace} = props;

  return (
    <styled.Container data-testid="SpaceList-test">
      {spaceListByCategory.map(({name, spaceList}) => (
        <div key={name}>
          <styled.CategoryName label={name} type="h4" align="left" />
          {spaceList.map((spaceInfo) => (
            <SpaceListItem
              key={spaceInfo.id}
              spaceInfo={spaceInfo}
              // TODO: Not implemented yet
              isFavorite={false}
              onTeleportToSpace={onTeleportToSpace}
              onSelectSpace={onSelectSpace}
            />
          ))}
        </div>
      ))}
    </styled.Container>
  );
};

export default observer(SpaceList);
