import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {useI18n} from '@momentum-xyz/core';

import {useBlockchain} from 'shared/hooks';
import {StakeModelInterface} from 'core/models';
import {TOAST_NOT_AUTO_CLOSE_OPTIONS, ToastContent} from 'ui-kit';

import * as styled from './UnstakeWorld.styled';

interface PropsInterface {
  targetStake: StakeModelInterface;
  onUnStaked: () => void;
  onCanceled: () => void;
}

const UnstakeWorld: FC<PropsInterface> = ({targetStake, onUnStaked, onCanceled}) => {
  const {isBlockchainReady, walletSelectContent, unstake} = useBlockchain({
    requiredAccountAddress: targetStake.wallet_id
  });

  const {t} = useI18n();

  const handleUnstake = useCallback(async () => {
    try {
      console.log('Unstake: ', targetStake.object_id);
      await unstake(targetStake.object_id, targetStake.kind);
      console.log('Unstake success: ', targetStake.object_id);
      onUnStaked();

      toast.info(
        <ToastContent icon="alert" text={t('messages.unStakedSuccess', {name: targetStake.name})} />
      );
    } catch (err) {
      console.log('Unstake error: ', err);
      onCanceled();

      toast.error(
        <ToastContent
          isDanger
          icon="alert"
          text={t('messages.unStakedError', {name: targetStake.name})}
        />
      );
    }
  }, [
    targetStake.object_id,
    targetStake.name,
    targetStake.kind,
    unstake,
    onUnStaked,
    t,
    onCanceled
  ]);

  useEffect(() => {
    if (isBlockchainReady) {
      toast.info(
        <ToastContent
          icon="alert"
          text={t('messages.askToUnstake')}
          approveInfo={{title: t('actions.yes'), onClick: handleUnstake}}
          declineInfo={{title: t('actions.no'), onClick: onCanceled}}
        />,
        TOAST_NOT_AUTO_CLOSE_OPTIONS
      );
    }
  }, [handleUnstake, isBlockchainReady, onCanceled, t]);

  return <styled.Wrapper data-testid="UnstakeWorld-test">{walletSelectContent}</styled.Wrapper>;
};

export default observer(UnstakeWorld);
