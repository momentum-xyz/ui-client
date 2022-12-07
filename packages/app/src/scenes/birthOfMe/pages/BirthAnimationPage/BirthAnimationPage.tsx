import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';

import {ExplorePanel} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {useStore, useSupernova} from 'shared/hooks';

import * as styled from './BirthAnimationPage.styled';

const BirthAnimationPage: FC = () => {
  const {exploreStore, nftStore, map3dStore, widgetsStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    exploreStore.init();

    setTimeout(() => {
      history.push(ROUTES.explore);
    }, 5 * 1000);
  }, [exploreStore, history]);

  useSupernova();

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
            onSearch={nftStore.searchNft}
            onSelect={(nft) => {
              map3dStore.selectOdyssey(nft);
              widgetsStore.profileStore.profileDialog.close();
            }}
            onTeleport={(nft) => {
              console.log(nft);
              if (nft.uuid) {
                history.push(generatePath(ROUTES.odyssey.base, {worldId: nft.uuid}));
              }
            }}
            onConnect={(id) => alert(`Connect to ${id}`)}
          />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(BirthAnimationPage);
