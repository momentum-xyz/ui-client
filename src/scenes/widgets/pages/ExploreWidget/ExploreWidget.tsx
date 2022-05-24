import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {SpacesList, SelectedSpace} from 'scenes/widgets/pages/ExploreWidget/components';
import {useStore} from 'shared/hooks';
import {ExpandableLayout, Heading, Loader, SearchInput, useDebouncedEffect} from 'ui-kit';

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

  useEffect(() => {
    exploreStore.selectSpace(worldStore.worldId);
  }, [exploreStore, worldStore.worldId]);

  useDebouncedEffect(
    () => {
      if (exploreStore.isSearching) {
        exploreStore.search(exploreStore.searchQuery, worldStore.worldId);
      }
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
        {exploreStore.isSearching && (
          <>
            <styled.WorldNameContainer>
              <Heading
                label={t('labels.searchResults')}
                type="h1"
                align="left"
                transform="uppercase"
              />
            </styled.WorldNameContainer>
            {exploreStore.searchRequest.isPending ? <Loader /> : <SpacesList />}
          </>
        )}
        {!exploreStore.isSearching &&
          (exploreStore.selectedSpaceStore.didFetchSpaceInformation ? (
            <styled.Body>
              {exploreStore.previousItem &&
              exploreStore.selectedSpace?.id !== worldStore.worldId ? (
                <SelectedSpace />
              ) : (
                <>
                  <styled.WorldNameContainer>
                    <Heading
                      label={selectedSpace.name ?? ''}
                      type="h1"
                      align="left"
                      transform="uppercase"
                    />
                  </styled.WorldNameContainer>
                  <SpacesList />
                </>
              )}
            </styled.Body>
          ) : (
            <Loader />
          ))}
      </ExpandableLayout>
    </styled.Container>
  );
};

export default observer(ExploreWidget);
