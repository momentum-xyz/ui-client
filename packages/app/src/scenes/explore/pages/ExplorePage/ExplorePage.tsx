import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {ExplorePanel} from 'ui-kit';
import {ROUTES} from 'core/constants';

import {SelectedOdyssey} from './components';
import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  const {exploreStore, authStore, nftStore, map3dStore, widgetsStore} = useStore();

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
        <styled.Boxes>
          {!!map3dStore.selectedOdyssey && (
            <SelectedOdyssey
              odyssey={map3dStore.selectedOdyssey}
              onTeleport={() => {
                console.log(map3dStore.selectedOdyssey);
                if (map3dStore.selectedOdyssey?.uuid) {
                  history.push(
                    generatePath(ROUTES.odyssey.base, {worldId: map3dStore.selectedOdyssey?.uuid})
                  );
                }
              }}
              onConnect={
                map3dStore.selectedOdyssey.owner !== authStore.wallet
                  ? () => {
                      if (map3dStore.selectedOdyssey) {
                        nftStore.setConnectToNftItemId(map3dStore.selectedOdyssey.id);
                      }
                    }
                  : undefined
              }
              onDock={() => alert(`Dock`)}
              onClose={map3dStore.unselectOdyssey}
            />
          )}
        </styled.Boxes>

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
