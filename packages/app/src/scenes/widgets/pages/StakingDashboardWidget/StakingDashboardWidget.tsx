import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';

import * as styled from './StakingDashboardWidget.styled';
import {StakingDashboard} from './components';

const StakingDashboardWidget: FC = () => {
  const {mainStore, nftStore} = useStore();
  const {unityStore} = mainStore;

  const handleFocus = useCallback(() => {
    unityStore.changeKeyboardControl(false);
  }, [unityStore]);

  const handleBlur = useCallback(() => {
    unityStore.changeKeyboardControl(true);
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
      <styled.FullSizeWrapper onFocus={handleFocus} onBlur={handleBlur}>
        <StakingDashboard />
      </styled.FullSizeWrapper>
    </Dialog>
  );
};

export default observer(StakingDashboardWidget);
