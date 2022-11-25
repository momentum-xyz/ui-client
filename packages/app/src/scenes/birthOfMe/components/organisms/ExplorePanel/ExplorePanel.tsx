import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Heading, IconSvg, SearchInput, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import {OdysseyFeedInterface} from 'scenes/birthOfMe/stores/ExploreStore';

import {NewsFeed} from './components';
import * as styled from './ExplorePanel.styled';

interface PropsInterface {
  odysseyCount: number;
  newsFeed: OdysseyFeedInterface[];
  onTeleport: (id: string) => void;
  onConnect: (id: string) => void;
}

const ExplorePanel: FC<PropsInterface> = (props) => {
  const {odysseyCount, newsFeed, onTeleport, onConnect} = props;
  // const debouncedSearch = useDebouncedCallback(exploreStore.search, SEARCH_DELAY_MS);

  console.log(newsFeed);

  return (
    <Box size="small">
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

      <styled.Search>
        <SearchInput value="" placeholder="Search for Odysseys..." onChange={() => {}} />
      </styled.Search>

      <styled.Body>
        <NewsFeed newsFeed={newsFeed} onTeleport={onTeleport} onConnect={onConnect} />
        {/*isQueryValid && items.length === 0 && (
          <styled.EmptyResult>
            <Text text={t('messages.noResultsFound')} size="xs" />
          </styled.EmptyResult>
        )*/}
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
