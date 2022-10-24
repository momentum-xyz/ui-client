import React from 'react';
import {observer} from 'mobx-react-lite';
import {SEARCH_MINIMAL_CHARACTER_COUNT} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {SpaceItem} from './components';
import * as styled from './SpacesList.styled';

const SpacesList: React.FC = () => {
  const {
    homeStore: {exploreStore}
  } = useStore();
  const {selectedSpace, searchQuery, searchedSpacesByCategory} = exploreStore;

  const renderList = () => {
    if (!selectedSpace?.subSpaces) {
      return;
    }

    if (searchQuery && searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
      return searchedSpacesByCategory?.map((category) => (
        <styled.Category key={category.name}>
          <styled.CategoryName label={category.name} type="h4" align="left" />
          {category.spaces.map((space, index) => (
            <SpaceItem
              space={{
                id: space.id ?? '',
                name: space.name ?? '',
                hasSubspaces: space.hasSubspaces
              }}
              hasSubspaces={space.hasSubspaces}
              key={space.id}
              lastItem={false}
            />
          ))}
        </styled.Category>
      ));
    }

    if (selectedSpace.subSpaces.length === 0) {
      return null;
    }

    return selectedSpace.subSpaces.map((space, index) => (
      <SpaceItem
        space={space}
        hasSubspaces={space.hasSubspaces}
        key={space.id}
        lastItem={selectedSpace.subSpaces.length - 1 === index}
      />
    ));
  };

  return <styled.Container data-testid="SpacesList-test">{renderList()}</styled.Container>;
};

export default observer(SpacesList);
