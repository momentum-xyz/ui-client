import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {Footer} from 'ui-kit';
import {ExplorePanel, SelectedOdyssey, StakingForm} from 'scenes/birthOfMe/components';

import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  const {birthOfMeStore} = useStore();
  const {exploreStore, nftStore} = birthOfMeStore;

  useEffect(() => {
    exploreStore.init();
  }, [exploreStore]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          {!!exploreStore.selectedOdyssey && (
            <SelectedOdyssey
              odyssey={exploreStore.selectedOdyssey}
              onTeleport={() => alert(`Teleport`)}
              onConnect={() => {
                if (exploreStore.selectedOdyssey) {
                  nftStore.setConnectToNftItemId(exploreStore.selectedOdyssey.id);
                }
              }}
              onDock={() => alert(`Dock`)}
              onClose={() => alert('close')}
            />
          )}
        </styled.Boxes>

        {!!nftStore.connectToNftItemId && (
          <Dialog
            title="Personal Connecting Dashboard"
            icon="hierarchy"
            showCloseButton
            onClose={() => {
              nftStore.setConnectToNftItemId(null);
            }}
          >
            <StakingForm
              nftItemId={nftStore.connectToNftItemId}
              onComplete={() => {
                nftStore.setConnectToNftItemId(null);
              }}
            />
          </Dialog>
        )}

        <styled.Boxes>
          <ExplorePanel
            odysseyCount={exploreStore.odysseyCount}
            newsFeed={exploreStore.newsFeed}
            searchQuery={exploreStore.searchQuery}
            odysseyList={exploreStore.odysseyList}
            onSearch={exploreStore.searchOdysseys}
            onTeleport={(id) => alert(`Teleport to ${id}`)}
            // FIXME id type
            onConnect={(id) => nftStore.setConnectToNftItemId(+id)}
          />
        </styled.Boxes>
      </styled.Wrapper>

      <Footer />
    </styled.Container>
  );
};

export default observer(ExplorePage);
