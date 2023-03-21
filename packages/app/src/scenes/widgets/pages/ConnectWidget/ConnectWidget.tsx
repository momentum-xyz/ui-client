import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './ConnectWidget.styled';
import {StakingForm} from './components';

const ConnectWidget: FC = () => {
  const {unityStore, nftStore, sessionStore} = useStore();
  const {unityInstanceStore} = unityStore;

  const {t} = useI18n();

  useEffect(() => {
    unityInstanceStore.changeKeyboardControl(false);

    return () => {
      unityInstanceStore.changeKeyboardControl(true);
    };
  }, [unityInstanceStore]);

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
