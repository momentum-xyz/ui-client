import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';

import * as styled from './StakingWidget.styled';
import {StakingDashboard} from './components';

const StakingWidget: FC = () => {
  const {unityStore, nftStore} = useStore();
  const {unityInstanceStore} = unityStore;

  const {t} = useTranslation();

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
