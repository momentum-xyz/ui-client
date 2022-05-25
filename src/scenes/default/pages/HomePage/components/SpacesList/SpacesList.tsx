import React from 'react';
import {observer} from 'mobx-react-lite';

import {SEARCH_MINIMAL_CHARACTER_COUNT} from 'core/constants';
import {SpaceItem} from 'scenes/default/pages/HomePage/components';
import {useStore} from 'shared/hooks';

import * as styled from './SpacesList.styled';

const SpacesList: React.FC = () => {
  const {
    homeStore: {exploreStore}
  } = useStore().defaultStore;
  const {selectedSpace, searchQuery, searchedSpaces} = exploreStore;

  const renderList = () => {
    if (!selectedSpace?.subSpaces) {
      return;
    }

    if (searchQuery && searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
      return searchedSpaces?.map((space) => (
        <SpaceItem
          space={{
            id: space.id ?? '',
            name: space.name ?? '',
            hasSubspaces: space.subSpaces.length > 0
          }}
          hasSubspaces={space.subSpaces.length > 0}
          key={`space-${space.id}`}
        />
      ));
    }

    if (selectedSpace.subSpaces.length === 0) {
      return null;
    }

    return selectedSpace.subSpaces.map((space) => (
      <SpaceItem space={space} hasSubspaces={space.hasSubspaces} key={`space-${space.id}`} />
    ));
  };

  return <styled.Container>{renderList()}</styled.Container>;
};

export default observer(SpacesList);
