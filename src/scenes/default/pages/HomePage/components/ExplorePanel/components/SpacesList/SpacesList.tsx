import React from 'react';
import {observer} from 'mobx-react-lite';

import {SEARCH_MINIMAL_CHARACTER_COUNT} from 'core/constants';
import {useStore} from 'shared/hooks';

import {SpaceItem} from './components';
import * as styled from './SpacesList.styled';

const SpacesList: React.FC = () => {
  const {
    homeStore: {exploreStore}
  } = useStore().defaultStore;
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
                hasSubspaces: space.subSpaces.length > 0
              }}
              hasSubspaces={space.subSpaces.length > 0}
              key={`space-${space.id}`}
              lastItem={category.spaces.length - 1 === index}
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
        key={`space-${space.id}`}
        lastItem={selectedSpace.subSpaces.length - 1 === index}
      />
    ));
  };

  return <styled.Container>{renderList()}</styled.Container>;
};

export default observer(SpacesList);
