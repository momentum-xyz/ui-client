import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';
import {NewsfeedTypeEnum} from 'core/enums';

import {BuildOdyssey} from './components';
import * as styled from './BirthOfMePage.styled';

const BirthOfMePage: FC = () => {
  const {exploreStore, nftStore, signInStore, sessionStore} = useStore();

  const navigate = useNavigate();

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
      await exploreStore.createNewsfeedItem({
        uuid: nft.uuid,
        type: NewsfeedTypeEnum.CREATED,
        date: new Date().toISOString()
      });
    }

    navigate(ROUTES.birthAnimation);
  }, [exploreStore, navigate, nft, nftStore, sessionStore, signInStore]);

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
