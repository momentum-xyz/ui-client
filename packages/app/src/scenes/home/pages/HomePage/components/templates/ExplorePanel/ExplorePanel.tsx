import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Loader, SearchInput, useDebouncedEffect} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {SpacesList, SelectedSpace, Header} from './components';
import * as styled from './ExplorePanel.styled';

const ExplorePanel: FC = () => {
  const {homeStore, mainStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {exploreStore} = homeStore;

  const {t} = useTranslation();

  const handleSearchFocus = (isFocused: boolean) => {
    unityStore.changeKeyboardControl(!isFocused);
  };

  useEffect(() => {
    exploreStore.selectSpace(worldStore.worldId);
  }, [exploreStore, worldStore.worldId]);

  useDebouncedEffect(
    () => {
      if (exploreStore.isSearch) {
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
      setExpand={exploreStore.setExpand}
      size={{width: '200px'}}
    >
      <SearchInput
        value={exploreStore.searchQuery}
        onChange={exploreStore.setSearchQuery}
        placeholder={t(`placeholders.searchForSpaces`)}
        onFocus={() => handleSearchFocus(true)}
        onBlur={() => handleSearchFocus(false)}
      />

      {!exploreStore.isSearch ? (
        <styled.Body>
          <SelectedSpace isWorld={exploreStore.selectedSpace?.id === worldStore.worldId} />
        </styled.Body>
      ) : (
        <>
          <Header title={t('labels.searchResults')} />
          <SpacesList />
        </>
      )}

      {exploreStore.isLoading && (
        <styled.Loader>
          <Loader />
        </styled.Loader>
      )}
    </styled.CustomExpandableLayout>
  );
};

export default observer(ExplorePanel);
