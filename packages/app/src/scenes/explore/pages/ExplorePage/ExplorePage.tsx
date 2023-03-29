import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ExplorePanel} from 'ui-kit';
import {ROUTES} from 'core/constants';

const ExplorePage: FC = () => {
  const {exploreStore, nftStore, widgetsStore, sessionStore} = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    exploreStore.init();

    const timeInterval = setInterval(() => {
      exploreStore.fetchNewsfeed();
    }, 15000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [exploreStore]);

  return (
    <ExplorePanel
      newsfeed={exploreStore.newsfeed}
      nftItems={nftStore.nftItems}
      searchQuery={nftStore.searchQuery}
      odysseyList={nftStore.searchedNftItems}
      currentUser={sessionStore.user}
      onSearch={nftStore.searchNft}
      onSelect={(nft) => {
        widgetsStore.odysseyInfoStore.open(nft.uuid);
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
      onOpenOdyssey={(uuid) => widgetsStore.odysseyInfoStore.open(uuid)}
    />
  );
};

export default observer(ExplorePage);
