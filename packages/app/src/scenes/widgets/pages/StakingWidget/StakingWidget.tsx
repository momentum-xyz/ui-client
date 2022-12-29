import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';

import * as styled from './StakingWidget.styled';
import {StakingDashboard} from './components';

const StakingWidget: FC = () => {
  const {mainStore, nftStore} = useStore();
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
