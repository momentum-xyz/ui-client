import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Heading, IconSvg, SearchInput, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';

import {ItemsList} from './components';
import * as styled from './ExplorePanel.styled';

const ExplorePanel: FC = () => {
  // const debouncedSearch = useDebouncedCallback(exploreStore.search, SEARCH_DELAY_MS);

  return (
    <Box size="small">
      <styled.Heading>
        <IconSvg name="planet" size="large" />
        <styled.Number>13095</styled.Number>
      </styled.Heading>
      <styled.Message>
        <Text size="xxs" text="People have minted their" align="right" />
        <Text size="xxs" text="Odyssey" align="right" />
      </styled.Message>

      <styled.Explore>
        <IconSvg name="explore" size="medium" />
        <Heading type="h2" label="Explore" weight="normal" />
      </styled.Explore>

      <SearchInput value="" placeholder="Search for Odysseys..." onChange={() => {}} />

      <styled.Body>
        <ItemsList
          items={[]}
          onTeleport={() => {
            console.log('teleport');
          }}
          onSelect={() => {
            console.log('select');
          }}
        />
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
