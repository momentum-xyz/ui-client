import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {BuildOdyssey} from './components';
import * as styled from './BirthOfMePage.styled';

const BirthOfMePage: FC = () => {
  const {exploreStore, nftStore, signInStore, sessionStore} = useStore();

  const history = useHistory();

  const nft = signInStore.wallet ? nftStore.getNftByWallet(signInStore.wallet) : null;

  const onBuild = useCallback(async () => {
    const address = nftStore.getAddressByWallet(signInStore.wallet);
    if (address) {
      await sessionStore.fetchTokenByWallet(address);
    }

    const form = {name: nft?.name, avatarHash: nft?.image};
    const isDone = await signInStore.updateProfile(form);
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
  }, [exploreStore, history, nft, nftStore, sessionStore, signInStore]);

  if (!nft) {
    return null;
  }

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <BuildOdyssey name={nft.name} onBuild={onBuild} disabled={!nft || !signInStore.wallet} />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(BirthOfMePage);
