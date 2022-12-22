import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';

import * as styled from './ConnectingDashboardWidget.styled';
import {StakingForm} from './components';

const ConnectingDashboardWidget: FC = () => {
  const {mainStore, nftStore, sessionStore} = useStore();
  const {unityStore} = mainStore;

  useEffect(() => {
    unityStore.changeKeyboardControl(false);

    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, [unityStore]);

  return (
    <Dialog
      title={t('staking.title')}
      icon="hierarchy"
      showCloseButton
      layoutSize={{height: '510px'}}
      onClose={() => {
        nftStore.setConnectToNftItemId(null);
      }}
    >
      <styled.FullSizeWrapper>
        {!!nftStore.connectToNftItemId && (
          <StakingForm
            isGuest={sessionStore.isGuest}
            nftItemId={nftStore.connectToNftItemId}
            onComplete={() => {
              nftStore.setConnectToNftItemId(null);
            }}
          />
        )}
      </styled.FullSizeWrapper>
    </Dialog>
  );
};

export default observer(ConnectingDashboardWidget);
