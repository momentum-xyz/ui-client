import {observer} from 'mobx-react-lite';
import React, {FC, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Heading, Loader, SearchInput, useDebouncedEffect} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';

import {SpacesList, SelectedSpace} from './components';
import * as styled from './ExplorePanel.styled';

const ExplorePanel: FC = () => {
  const {homeStore, mainStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {exploreStore} = homeStore;
  const {selectedSpace} = exploreStore;

  const {t} = useTranslation();

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
    <styled.CustomExpandableLayout
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
          {exploreStore.searchRequest.isPending ? (
            <styled.Loader>
              <Loader />
            </styled.Loader>
          ) : (
            <SpacesList />
          )}
        </>
      )}
      {!exploreStore.isSearching &&
        (exploreStore.selectedSpace?.didFetchSpaceInformation ? (
          <styled.Body>
            {exploreStore.previousItem && exploreStore.selectedSpace?.id !== worldStore.worldId ? (
              <SelectedSpace />
            ) : (
              <>
                <styled.WorldNameContainer>
                  <Heading
                    label={selectedSpace?.name ?? ''}
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
          <styled.Loader>
            <Loader />
          </styled.Loader>
        ))}
    </styled.CustomExpandableLayout>
  );
};

export default observer(ExplorePanel);
