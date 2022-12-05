import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Heading, IconSvg} from '@momentum-xyz/ui-kit';

import {NftFeedItemInterface} from 'api';
import {NftItemInterface} from 'stores/NftStore/models';
import {NewsFeedItem} from 'ui-kit';

import * as styled from './NewsFeed.styled';

interface PropsInterface {
  nftFeed: NftFeedItemInterface[];
  onTeleport: (nft: NftItemInterface) => void;
  onConnect: (id: number) => void;
}

const NewsFeed: FC<PropsInterface> = (props) => {
  const {nftFeed, onTeleport, onConnect} = props;

  return (
    <styled.Container data-testid="NewsFeed-test">
      <styled.Explore>
        <IconSvg name="solar-system" size="medium" />
        <Heading type="h2" label="Newsfeed" weight="normal" />
      </styled.Explore>

      <styled.Feed>
        {!!nftFeed.length && (
          <>
            {nftFeed.map((item) => (
              <NewsFeedItem
                key={item.id}
                item={item}
                onTeleport={onTeleport}
                onConnect={onConnect}
              />
            ))}
          </>
        )}
      </styled.Feed>
    </styled.Container>
  );
};

export default observer(NewsFeed);
