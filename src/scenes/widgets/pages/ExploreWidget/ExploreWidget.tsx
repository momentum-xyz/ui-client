import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {SpacesList, SelectedSpace} from 'scenes/widgets/pages/ExploreWidget/components';
import {useStore} from 'shared/hooks';
import {ExpandableLayout, Heading, SearchInput, useDebouncedEffect} from 'ui-kit';

import * as styled from './ExploreWidget.styled';

const ExploreWidget: FC = () => {
  const {
    widgetStore: {exploreStore},
    mainStore: {unityStore, worldStore}
  } = useStore();

  const {t} = useTranslation();

  const {
    selectedSpaceStore: {space: selectedSpace}
  } = exploreStore;

  const handleSearchFocus = (isFocused: boolean) => {
    unityStore.changeKeyboardControl(!isFocused);
  };

  const handleGoBackToWorld = () => {
    exploreStore.selectSpace(worldStore.worldId);
    // setSelectedUserInitiative(undefined);
  };

  useEffect(() => {
    exploreStore.selectSpace(worldStore.worldId);
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
        size={{width: '200px'}}
      >
        <SearchInput
          value={exploreStore.searchQuery}
          onChange={exploreStore.setSearchQuery}
          placeholder={t(`placeholders.searchForSpaces`)}
          onFocus={() => handleSearchFocus(true)}
          onBlur={() => handleSearchFocus(false)}
        />
        <styled.Body>
          {selectedSpace.id === worldStore.worldId && (
            <styled.WorldNameContainer onClick={handleGoBackToWorld}>
              <Heading
                label={selectedSpace.name ?? ''}
                type="h1"
                align="left"
                transform="uppercase"
              />
            </styled.WorldNameContainer>
          )}
          {selectedSpace.id !== worldStore.worldId && <SelectedSpace />}
          {selectedSpace.id === worldStore.worldId && <SpacesList />}
        </styled.Body>
      </ExpandableLayout>
    </styled.Container>
  );
};

export default observer(ExploreWidget);
