import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Heading, IconSvg, SearchInput, Text, useDebouncedCallback} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import cn from 'classnames';

import {Box} from 'ui-kit';
import {NewsfeedItemInterface} from 'api';
import {SearchQueryModelModelType, UserModelInterface} from 'core/models';
import {NftItemModelInterface} from 'core/models';

import {NewsfeedList, OdysseyList} from './components';
import * as styled from './ExplorePanel.styled';

interface PropsInterface {
  searchQuery: SearchQueryModelModelType;
  newsfeed: NewsfeedItemInterface[];
  nftItems: NftItemModelInterface[];
  odysseyList: NftItemModelInterface[];
  currentUser: UserModelInterface | null;
  onSearch: () => void;
  onTeleport: (nft: NftItemModelInterface) => void;
  onSelect: (nft: NftItemModelInterface) => void;
  onAttend: (nft: NftItemModelInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const SEARCH_DELAY_MS = 200;

const ExplorePanel: FC<PropsInterface> = ({
  newsfeed,
  nftItems,
  odysseyList,
  searchQuery,
  currentUser,
  onSearch,
  onTeleport,
  onSelect,
  onAttend,
  onConnect,
  onOpenOdyssey
}) => {
  const {t} = useI18n();

  const debouncedSearch = useDebouncedCallback(onSearch, SEARCH_DELAY_MS);

  return (
    <Box size="big">
      <styled.Heading>
        <IconSvg name="planet" size="large" />
        <styled.Number>{nftItems.length}</styled.Number>
      </styled.Heading>
      <styled.Message>
        <Text size="xxs" text="People have minted their" align="right" />
        <Text size="xxs" text="Odyssey" align="right" />
      </styled.Message>

      <styled.Explore>
        <IconSvg name="explore" size="medium" />
        <Heading type="h2" label="Explore" weight="normal" />
      </styled.Explore>

      <styled.Search className={cn(searchQuery.isQueryValid && 'isSearch')}>
        <SearchInput
          value={searchQuery.query}
          placeholder="Search for Odysseys..."
          onChange={(query) => {
            searchQuery.setQuery(query);
            debouncedSearch();
          }}
        />
      </styled.Search>

      <styled.Body>
        {!searchQuery.isQueryValid && (
          <NewsfeedList
            nftFeed={newsfeed}
            nftItems={nftItems}
            currentUser={currentUser}
            onTeleport={onTeleport}
            onConnect={onConnect}
            onAttend={onAttend}
            onOpenOdyssey={onOpenOdyssey}
          />
        )}

        {searchQuery.isQueryValid && (
          <OdysseyList odysseyList={odysseyList} onTeleport={onTeleport} onSelect={onSelect} />
        )}

        {searchQuery.isQueryValid && odysseyList.length === 0 && (
          <styled.EmptyResult>
            <Text text={t('messages.noResultsFound')} size="xs" />
          </styled.EmptyResult>
        )}
      </styled.Body>
    </Box>
  );
};

export default observer(ExplorePanel);
