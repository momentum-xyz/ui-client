import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './ConnectWidget.styled';
import {StakingForm} from './components';

const ConnectWidget: FC = () => {
  const {universeStore, nftStore, sessionStore} = useStore();
  const {instance3DStore} = universeStore;

  const {t} = useI18n();

  useEffect(() => {
    instance3DStore.changeKeyboardControl(false);

    return () => {
      instance3DStore.changeKeyboardControl(true);
    };
  }, [instance3DStore]);

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
