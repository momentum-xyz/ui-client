import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './ConnectWidget.styled';
import {StakingForm} from './components';

const ConnectWidget: FC = () => {
  const {universeStore, nftStore, sessionStore} = useStore();
  const {world3dStore} = universeStore;

  const {t} = useI18n();

  useEffect(() => {
    world3dStore?.changeKeyboardControl(false);

    return () => {
      world3dStore?.changeKeyboardControl(true);
    };
  }, [world3dStore]);

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

export default observer(ConnectWidget);
