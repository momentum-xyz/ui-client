import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Heading, IconSvg, SearchInput, Text, useDebouncedCallback} from '@momentum-xyz/ui-kit';
import cn from 'classnames';

import {Box} from 'ui-kit';
import {NftFeedItemInterface} from 'api';
import {SearchQueryModelModelType} from 'core/models';
import {NftItemInterface} from 'stores/NftStore/models';

import {NewsFeed, OdysseyList} from './components';
import * as styled from './ExplorePanel.styled';

interface PropsInterface {
  odysseyCount: number;
  searchQuery: SearchQueryModelModelType;
  nftFeed: NftFeedItemInterface[];
  odysseyList: NftItemInterface[];
  currentUserId: string;
  onSearch: () => void;
  onTeleport: (nft: NftItemInterface) => void;
  onSelect: (nft: NftItemInterface) => void;
  onAttend: (nft: NftItemInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const SEARCH_DELAY_MS = 200;

const ExplorePanel: FC<PropsInterface> = ({
  odysseyCount,
  nftFeed,
  odysseyList,
  searchQuery,
  currentUserId,
  onSearch,
  onTeleport,
  onSelect,
  onAttend,
  onConnect,
  onOpenOdyssey
}) => {
  const debouncedSearch = useDebouncedCallback(onSearch, SEARCH_DELAY_MS);

  return (
    <Box size="big">
      <styled.Heading>
        <IconSvg name="planet" size="large" />
        <styled.Number>{odysseyCount}</styled.Number>
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
          <NewsFeed
            nftFeed={nftFeed}
            currentUserId={currentUserId}
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
            <Text text="No results found" size="xs" />
          </styled.EmptyResult>
        )}
      </styled.Body>

      {/*isLoading && (
        <styled.Loader>
          <Loader />
        </styled.Loader>
      )*/}
    </Box>
  );
};

export default observer(ExplorePanel);
