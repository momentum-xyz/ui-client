import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {Heading, Loader, SearchInput, Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {
  ItemsList
  //  ItemDetail
} from './components';
import * as styled from './ExplorePanel.styled';

const PANEL_WIDTH_PX = 200;
// const SEARCH_DELAY_MS = 200;

const ExplorePanel: FC = () => {
  const {birthOfMeStore} = useStore();
  const {startStore} = birthOfMeStore;
  const {
    items,
    filteredItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    isQueryValid,
    isExpanded,
    setIsExpanded
  } = startStore;

  console.log('render explore panel', {
    items,
    itemsLength: items.length,
    filteredItems,
    isLoading,
    searchQuery,
    setSearchQuery,
    isQueryValid,
    isExpanded,
    setIsExpanded
  });

  const {t} = useTranslation();

  // const debouncedSearch = useDebouncedCallback(exploreStore.search, SEARCH_DELAY_MS);

  return (
    <styled.CustomExpandableLayout
      iconName="explore"
      name={t('labels.explore')}
      isExpanded={isExpanded}
      setExpand={setIsExpanded}
      size={{width: `${PANEL_WIDTH_PX}px`}}
    >
      <SearchInput
        value={searchQuery}
        placeholder={t(`placeholders.searchForSpaces`)}
        // onFocus={() => unityStore.changeKeyboardControl(false)}
        // onBlur={() => unityStore.changeKeyboardControl(true)}
        onChange={setSearchQuery}
      />

      {/* {!searchQuery.isQueryValid && !!spaceDetails && !exploreStore.isLoading && (
        <styled.Body>
          <ItemDetail
            space={spaceDetails}
            previousSpace={history.previousSpace}
            isWorld={spaceDetails.id === worldStore.worldId}
            onTeleportToSpace={unityStore.teleportToSpace}
            onSelectSpace={exploreStore.selectSpace}
            onGoBack={exploreStore.goBackToPreviousSpace}
          />
        </styled.Body>
      )} */}

      <styled.Body>
        <styled.Heading>
          <Heading label={t('labels.searchResults')} type="h1" align="left" transform="uppercase" />
        </styled.Heading>
        <ItemsList
          items={isQueryValid ? filteredItems : items}
          onTeleport={() => {
            console.log('teleport');
          }}
          onSelect={() => {
            console.log('select');
          }}
        />
        {isQueryValid && filteredItems.length === 0 && (
          <styled.EmptyResult>
            <Text text={t('messages.noResultsFound')} size="xs" />
          </styled.EmptyResult>
        )}
      </styled.Body>

      {isLoading && (
        <styled.Loader>
          <Loader />
        </styled.Loader>
      )}
    </styled.CustomExpandableLayout>
  );
};

export default observer(ExplorePanel);
