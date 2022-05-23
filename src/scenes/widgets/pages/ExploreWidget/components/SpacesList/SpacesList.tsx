import React from 'react';
import {observer} from 'mobx-react-lite';

import {SEARCH_MINIMAL_CHARACTER_COUNT} from 'core/constants';
import {Text} from 'ui-kit';
import {SpaceItem} from 'scenes/widgets/pages/ExploreWidget/components';
import {useStore} from 'shared/hooks';

import * as styled from './SpacesList.styled';

const SpacesList: React.FC = () => {
  const {exploreStore} = useStore().widgetStore;
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
          onSelect={exploreStore.selectSpace}
          key={`space-${space.id}`}
        />
      ));
    }

    if (selectedSpace.subSpaces.length === 0) {
      return (
        <div>
          <Text text="This space doesn't" size="xs" align="left" />
          <Text text="have any subspaces" size="xs" align="left" />
        </div>
      );
    }

    return selectedSpace.subSpaces.map((space) => (
      <SpaceItem
        space={space}
        hasSubspaces={space.hasSubspaces}
        onSelect={exploreStore.selectSpace}
        key={`space-${space.id}`}
      />
    ));
  };

  return <styled.Container>{renderList()}</styled.Container>;
};

export default observer(SpacesList);
