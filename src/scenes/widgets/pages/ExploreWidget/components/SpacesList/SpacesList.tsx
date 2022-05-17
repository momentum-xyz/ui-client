import React from 'react';

import {useStore} from 'shared/hooks';
import {SEARCH_MINIMAL_CHARACTER_COUNT} from 'core/constants';
import {Text} from 'ui-kit';
import {SpaceItem} from 'scenes/widgets/pages/ExploreWidget/components';
import {SpaceModelInterface, SubSpaceModelInterface} from 'core/models';

import * as styled from './SpacesList.styled';

interface SpacesListPropsInterface {
  spaceId: string;
  onSpaceSelect: (spaceId?: string) => void;
  searchQuery?: string;
  searchedSpaces?: SpaceModelInterface[];
}

const SpacesList: React.FC<SpacesListPropsInterface> = ({
  spaceId,
  onSpaceSelect,
  searchQuery,
  searchedSpaces
}) => {
  const {
    widgetStore: {exploreStore}
  } = useStore();
  const {selectedSpaceStore} = exploreStore;

  const {space: selectedSpace} = selectedSpaceStore;

  const renderList = () => {
    if (!selectedSpace.subSpaces) {
      return;
    }

    const spaceStoreSorter = (spaceA: SpaceModelInterface, spaceB: SpaceModelInterface) =>
      spaceA.name?.localeCompare(spaceB?.name ?? '') ?? 0;

    const spaceSorter = (a: SubSpaceModelInterface, b: SubSpaceModelInterface) =>
      a.name?.localeCompare(b.name ?? '') ?? 0;

    if (searchQuery && searchQuery.length >= SEARCH_MINIMAL_CHARACTER_COUNT) {
      return searchedSpaces?.sort(spaceStoreSorter).map((space) => (
        <SpaceItem
          space={{
            id: space.id ?? '',
            name: space.name ?? '',
            hasSubspaces: space.subSpaces.length > 0
          }}
          hasSubspaces={space.subSpaces.length > 0}
          onSelect={onSpaceSelect}
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

    return selectedSpace.subSpaces
      .sort(spaceSorter)
      .map((space) => (
        <SpaceItem
          space={space}
          hasSubspaces={space.hasSubspaces}
          onSelect={onSpaceSelect}
          key={`space-${space.id}`}
        />
      ));
  };

  return <styled.Container>{renderList()}</styled.Container>;
};

export default SpacesList;
