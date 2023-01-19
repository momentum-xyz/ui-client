import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ExplorePanel} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  const {exploreStore, nftStore, widgetsStore, sessionStore} = useStore();

  const navigate = useNavigate();

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
            currentUserId={sessionStore.userId}
            onSearch={nftStore.searchNft}
            onSelect={(nft) => {
              widgetsStore.odysseyInfoStore.open(nft);
              widgetsStore.profileStore.dialog.close();
            }}
            onTeleport={(nft) => {
              console.log(nft);
              if (nft.uuid) {
                navigate(generatePath(ROUTES.odyssey.base, {worldId: nft.uuid}), {replace: true});
              }
            }}
            onAttend={(nft) => {
              console.log(nft);
            }}
            // FIXME id type
            onConnect={(id) => nftStore.setConnectToNftItemId(+id)}
            onOpenOdyssey={(uuid) =>
              widgetsStore.odysseyInfoStore.open(nftStore.getNftByUuid(uuid))
            }
          />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(ExplorePage);
