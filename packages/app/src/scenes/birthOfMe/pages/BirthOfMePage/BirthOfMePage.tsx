import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {
  // generatePath,
  useHistory
} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {BuildOdyssey} from './components';
import * as styled from './BirthOfMePage.styled';

const BirthOfMePage: FC = () => {
  const {exploreStore, nftStore, authStore, signInAccountStore, sessionStore} = useStore();

  const nft = authStore.wallet ? nftStore.getNftByWallet(authStore.wallet) : null;

  const history = useHistory();

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

    const from = window.history.state?.state?.from;
    history.push(ROUTES.birthAnimation, {from: from || ROUTES.explore});
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
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(BirthOfMePage);
