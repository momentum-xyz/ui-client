import {t} from 'i18next';
import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';

import {SpacesList} from 'scenes/widgets/pages/ExploreWidget/components';
import SocialSelectedSpace from 'component/molucules/socialui/SocialSelectedSpace';
import {useStore} from 'shared/hooks';
import {ExpandableLayout, Heading, SearchInput, useDebouncedEffect} from 'ui-kit';

import * as styled from './ExploreWidget.styled';

const ExploreWidget: FC = () => {
  const {
    widgetStore: {exploreStore},
    mainStore: {unityStore, worldStore}
  } = useStore();

  const {
    worldSpaceStore: {space: world},
    selectedSpaceStore: {space: selectedSpace}
  } = exploreStore;

  const handleSearchFocus = (isFocused: boolean) => {
    unityStore.changeKeyboardControl(!isFocused);
  };

  const handleSpaceSelect = (spaceId?: string) => {
    if (spaceId) {
      exploreStore.selectSpace(spaceId);
    } else {
      exploreStore.unselectSpace();
    }
  };

  const handleGoBackClick = () => {
    exploreStore.unselectSpace();
    // setSelectedUserInitiative(undefined);
  };

  useEffect(() => {
    if (exploreStore.isExpanded) {
      exploreStore.fetchWorldInformation(worldStore.worldId);
    }

    return exploreStore.worldSpaceStore.resetModel;
  }, [exploreStore, worldStore.worldId]);

  useDebouncedEffect(
    () => {
      exploreStore.search(exploreStore.searchQuery, worldStore.worldId);
    },
    200,
    [exploreStore.searchQuery, worldStore.worldId]
  );

  return (
    <styled.Container>
      <ExpandableLayout
        iconName="explore"
        name={t('labels.explore')}
        isExpanded={exploreStore.isExpanded}
        setExpand={exploreStore.toggleExpand}
      >
        <SearchInput
          value={exploreStore.searchQuery}
          onChange={exploreStore.setSearchQuery}
          onFocus={() => handleSearchFocus(true)}
          onBlur={() => handleSearchFocus(false)}
        />
        <styled.Body>
          {!selectedSpace && (
            <styled.WorldNameContainer onClick={handleGoBackClick}>
              <Heading label={world.name ?? ''} type="h4" align="left" />
            </styled.WorldNameContainer>
          )}
          {selectedSpace.id && (
            <SocialSelectedSpace
              spaceId={selectedSpace.id}
              fatherSpaceName={world.name ?? ''}
              ancestors={world.name ? [world.name] : []}
              onBack={handleGoBackClick}
            />
          )}
          {!selectedSpace && world.id && (
            <SpacesList
              spaceId={world.id}
              onSpaceSelect={handleSpaceSelect}
              searchQuery={exploreStore.searchQuery}
              searchedSpaces={exploreStore.searchedSpaces}
            />
          )}
        </styled.Body>
      </ExpandableLayout>
    </styled.Container>
  );
};

export default observer(ExploreWidget);
