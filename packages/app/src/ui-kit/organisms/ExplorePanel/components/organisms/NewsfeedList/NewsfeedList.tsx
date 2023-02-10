import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Heading, IconSvg} from '@momentum-xyz/ui-kit';

import {NewsfeedItemInterface} from 'api';
import {NftItemModelInterface, UserModelInterface} from 'core/models';
import {NewsfeedItem} from 'ui-kit';

import * as styled from './NewsfeedList.styled';

interface PropsInterface {
  nftFeed: NewsfeedItemInterface[];
  nftItems: NftItemModelInterface[];
  currentUser: UserModelInterface | null;
  onTeleport: (nft: NftItemModelInterface) => void;
  onAttend: (nft: NftItemModelInterface) => void;
  onConnect: (id: number) => void;
  onOpenOdyssey?: (uuid: string) => void;
}

const NewsfeedList: FC<PropsInterface> = (props) => {
  const {nftFeed, nftItems, currentUser, onTeleport, onAttend, onConnect, onOpenOdyssey} = props;

  return (
    <styled.Container data-testid="NewsFeed-test">
      <styled.Explore>
        <IconSvg name="solar-system" size="medium" />
        <Heading type="h2" label="Newsfeed" weight="normal" />
      </styled.Explore>

      <styled.Feed>
        {!!nftFeed.length && (
          <>
            {nftFeed.map((item, index) => (
              <NewsfeedItem
                key={index}
                item={item}
                nftItems={nftItems}
                currentUser={currentUser}
                onTeleport={onTeleport}
                onConnect={onConnect}
                onAttend={onAttend}
                onOpenOdyssey={onOpenOdyssey}
              />
            ))}
          </>
        )}
      </styled.Feed>
    </styled.Container>
  );
};

export default observer(NewsfeedList);
