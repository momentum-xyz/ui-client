import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import {Dialog} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {Footer, ToastContent} from 'ui-kit';
import {ExplorePanel, SelectedOdyssey, StakingForm} from 'scenes/birthOfMe/components';

import * as styled from './ExplorePage.styled';

const ExplorePage: FC = () => {
  const {birthOfMeStore, authStore} = useStore();
  const {exploreStore, nftStore} = birthOfMeStore;
  const {wallet} = authStore;

  const {t} = useTranslation();

  useEffect(() => {
    exploreStore.init();
  }, [exploreStore]);

  const onStake = (amount: number) => {
    console.log('onStake', wallet, exploreStore.selectedOdyssey);

    if (exploreStore.selectedOdyssey) {
      nftStore
        .stake(wallet, amount, exploreStore.selectedOdyssey.id, 0)
        .then(() => {
          console.log('stake success');
          toast.info(
            <ToastContent
              headerIconName="calendar"
              title={t('titles.alert')}
              text={t('messages.removeEventSuccess')}
              showCloseButton
            />
          );
          nftStore.setConnectToNftItemId(null);
        })
        .catch((err) => {
          console.log('stake error', err);
          toast.error(
            <ToastContent
              isDanger
              headerIconName="calendar"
              title={t('titles.alert')}
              text={t('errors.couldNotRemoveEvent')}
              showCloseButton
            />
          );
        });
    }
  };

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

        {!!nftStore.connectToNftItemId && !!wallet && (
          <Dialog
            title="Personal Connecting Dashboard"
            icon="hierarchy"
            showCloseButton
            onClose={() => {
              nftStore.setConnectToNftItemId(null);
            }}
          >
            <StakingForm onStake={onStake} />
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
