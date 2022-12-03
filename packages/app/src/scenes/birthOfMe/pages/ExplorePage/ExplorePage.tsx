import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {getSnapshot} from 'mobx-state-tree';
import {Dialog} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {ExplorePanel, SelectedOdyssey, StakingForm} from 'scenes/birthOfMe/components';

import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  const {birthOfMeStore, authStore} = useStore();
  const {exploreStore, nftStore} = birthOfMeStore;
  const {wallet} = authStore;

  useEffect(() => {
    exploreStore.init();
  }, [exploreStore]);

  useEffect(() => {
    if (wallet) {
      // FIXME move to more appropriate place
      console.log('Check if user has staked', wallet);
      const nftItem = nftStore.getNftByWallet(wallet);
      if (nftItem) {
        // TODO check also other user wallets??
        nftStore.fetchStakingInfo(wallet, nftItem.id).then(() => {
          console.log('Staking info fetched');
          console.log('mutualStakingAddresses:', nftStore.mutualStakingAddresses);
          console.log('stakingAtMe:', getSnapshot(nftStore.stakingAtMe));
          console.log('stakingAtOthers:', getSnapshot(nftStore.stakingAtOthers));
        });
      }
    }
  }, [nftStore, wallet]);

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
    </styled.Container>
  );
};

export default observer(ExplorePage);
