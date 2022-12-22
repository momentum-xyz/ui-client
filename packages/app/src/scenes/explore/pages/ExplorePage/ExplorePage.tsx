import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ExplorePanel} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  const {exploreStore, nftStore, widgetsStore, sessionStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    exploreStore.init();

    const timeInterval = setInterval(() => {
      exploreStore.fetchNewsFeed();
    }, 15000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [exploreStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes />

        <styled.Boxes>
          <ExplorePanel
            odysseyCount={nftStore.nftItems.length}
            nftFeed={exploreStore.nftFeed}
            searchQuery={nftStore.searchQuery}
            odysseyList={nftStore.searchedNftItems}
            userId={sessionStore.userId}
            onSearch={nftStore.searchNft}
            onSelect={(nft) => {
              widgetsStore.odysseyInfoStore.open(nft);
              widgetsStore.profileStore.dialog.close();
            }}
            onTeleport={(nft) => {
              console.log(nft);
              if (nft.uuid) {
                history.replace(generatePath(ROUTES.odyssey.base, {worldId: nft.uuid}));
              }
            }}
            onAttend={(nft) => {
              console.log(nft);
            }}
            // FIXME id type
            onConnect={(id) => nftStore.setConnectToNftItemId(+id)}
          />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(ExplorePage);
