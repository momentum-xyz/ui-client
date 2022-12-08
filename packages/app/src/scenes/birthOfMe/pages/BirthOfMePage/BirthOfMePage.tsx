import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {
  // generatePath,
  useHistory
} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {
  SinusBox
  //  ExplorePanel
} from 'ui-kit';

import {BuildOdyssey} from './components';
import * as styled from './BirthOfMePage.styled';

const BirthOfMePage: FC = () => {
  const {exploreStore, nftStore, authStore, signInAccountStore, sessionStore} = useStore();

  const nft = authStore.wallet ? nftStore.getNftByWallet(authStore.wallet) : null;

  const history = useHistory();

  useEffect(() => {
    sessionStore.loadUserProfile();
  }, [sessionStore]);

  const onBuild = async () => {
    const address = nftStore.getAddressByWallet(authStore.wallet);
    if (address) {
      await authStore.fetchTokenByWallet(address);
    }

    const isDone = await signInAccountStore.updateProfile({
      name: nft?.name,
      avatarHash: nft?.image
    });
    if (isDone) {
      await sessionStore.loadUserProfile();
    }

    if (nft) {
      await exploreStore.createNewsFeedItem({
        ...nft,
        type: 'created',
        date: new Date().toISOString()
      });
    }

    history.push(ROUTES.birthAnimation);
  };
  if (!nft) {
    return null;
  }

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <BuildOdyssey name={nft.name} onBuild={onBuild} disabled={!nft || !authStore.wallet} />
        </styled.Boxes>

        {/* <styled.Boxes>
          <ExplorePanel
            odysseyCount={nftStore.nftItems.length}
            nftFeed={exploreStore.nftFeed}
            searchQuery={nftStore.searchQuery}
            odysseyList={nftStore.searchedNftItems}
            onSearch={nftStore.searchNft}
            onSelect={map3dStore.selectOdyssey}
            onTeleport={(nft) => {
              console.log(nft);
              if (nft.uuid) {
                history.push(generatePath(ROUTES.odyssey.base, {worldId: nft.uuid}));
              }
            }}
            onConnect={(id) => alert(`Connect to ${id}`)}
          />
        </styled.Boxes> */}
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(BirthOfMePage);
