import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import * as styled from './StakingWidget.styled';
import {StakingDashboard} from './components';

const StakingWidget: FC = () => {
  const {universeStore, nftStore} = useStore();
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
      layoutSize={{height: '640px'}}
      onClose={() => {
        nftStore.stakingDashorboardDialog.close();
      }}
    >
      <styled.FullSizeWrapper>
        <StakingDashboard />
      </styled.FullSizeWrapper>
    </Dialog>
  );
};

export default observer(StakingWidget);
