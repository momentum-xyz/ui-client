import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';

import {SpaceItem} from './components';
import * as styled from './SpacesList.styled';

const SpacesList: FC = () => {
  const {homeStore} = useStore();
  const {exploreStore} = homeStore;
  const {spaceDetails, searchQuery, searchResults} = exploreStore;
  const {isQueryValid} = searchQuery;

  const renderList = () => {
    if (!spaceDetails?.subSpaces) {
      return;
    }

    if (isQueryValid) {
      return searchResults?.map((category) => (
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

    if (spaceDetails.subSpaces.length === 0) {
      return null;
    }

    return spaceDetails.subSpaces.map((space, index) => (
      <SpaceItem
        space={space}
        hasSubspaces={space.hasSubspaces}
        key={space.id}
        lastItem={spaceDetails.subSpaces.length - 1 === index}
      />
    ));
  };

  return <styled.Container data-testid="SpacesList-test">{renderList()}</styled.Container>;
};

export default observer(SpacesList);
