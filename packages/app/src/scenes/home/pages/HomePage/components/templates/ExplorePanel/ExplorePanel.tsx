import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Loader, SearchInput, useDebouncedCallback} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {SpacesList, SelectedSpace, Header} from './components';
import * as styled from './ExplorePanel.styled';

const PANEL_WIDTH_PX = 200;
const SEARCH_DELAY_MS = 200;

const ExplorePanel: FC = () => {
  const {homeStore, mainStore} = useStore();
  const {unityStore, worldStore} = mainStore;
  const {exploreStore} = homeStore;
  const {searchQuery} = exploreStore;

  const {t} = useTranslation();

  useEffect(() => {
    exploreStore.init(worldStore.worldId);
  }, [exploreStore, worldStore.worldId]);

  const debouncedSearch = useDebouncedCallback(() => {
    exploreStore.search(worldStore.worldId);
  }, SEARCH_DELAY_MS);

  return (
    <styled.CustomExpandableLayout
      iconName="explore"
      name={t('labels.explore')}
      isExpanded={exploreStore.isExpanded}
      setExpand={exploreStore.setExpand}
      size={{width: `${PANEL_WIDTH_PX}px`}}
    >
      <SearchInput
        value={searchQuery.query}
        placeholder={t(`placeholders.searchForSpaces`)}
        onFocus={() => unityStore.changeKeyboardControl(false)}
        onBlur={() => unityStore.changeKeyboardControl(true)}
        onChange={(query) => {
          searchQuery.setQuery(query);
          debouncedSearch();
        }}
      />

      {!searchQuery.isQueryValid ? (
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
