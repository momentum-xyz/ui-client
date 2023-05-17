import {FC, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import BN from 'bn.js';
import {useI18n} from '@momentum-xyz/core';
import {Panel, StepInterface, Steps} from '@momentum-xyz/ui-kit';

import {WidgetEnum} from 'core/enums';
import {convertUuidToNftId} from 'core/utils';
import {ProfileImage, ToastContent} from 'ui-kit';
import {useBlockchain, useStore} from 'shared/hooks';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import {StakeAmount, StakeAuthorize} from './components';
import * as styled from './StakingWidget.styled';

type StepsType = 'wallet' | 'authorize';
const DEFAULT_STAKING_AMOUNT = 1;
const AMOUNT_PRECISION_DIGITS = 5;
const PRECISION_MULTIPLIER = Math.pow(10, AMOUNT_PRECISION_DIGITS);

const StakingWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, nftStore, universeStore} = useStore();
  const {selectedWalletId, canBeStaked, addresses, chainDecimals} = nftStore;
  const {world2dStore} = universeStore;

  const [activeStep, setActiveStep] = useState<StepsType>('wallet');
  const [amountString, setAmountString] = useState(DEFAULT_STAKING_AMOUNT.toString());

  const {t} = useI18n();

  const {isBlockchainReady, walletSelectContent, account, stake} = useBlockchain({
    requiredAccountAddress: selectedWalletId
  });

  const worldId = data?.id?.toString() || universeStore.worldId;
  const worldName = world2dStore?.worldDetails?.world?.name || '';
  const worldNameWithHash = `${worldName} - ${convertUuidToNftId(world2dStore?.worldId)}`;

  // this allows us to use decimals while also validating with BN
  const amountAtoms = new BN(+amountString * PRECISION_MULTIPLIER).mul(
    new BN(Math.pow(10, chainDecimals) / PRECISION_MULTIPLIER)
  );
  const isBalanceTooLow = !canBeStaked(amountAtoms);

  console.log('StakeForm useStaking', {isBlockchainReady, account, stake});
  console.log('StakingForm', {selectedWalletId, addresses, amountString, amountAtoms});

  const handleOnClose = () => {
    widgetManagerStore.close(WidgetEnum.STAKING);
  };

  const onStake = async (comment: string) => {
    try {
      console.log('onStake', nftStore.selectedWalletId, worldId, amountAtoms);
      const result = await stake(worldId, amountAtoms);
      console.log('stake success');

      if (result?.transactionHash && !!comment) {
        // TODO use when supported by the controller, not implemented yet
        // PosBusService.userStakedInOdyssey(
        //   result.transactionHash,
        //   worldId,
        //   amountAtoms.toString(),
        //   comment
        // );
        nftStore.postPendingStake({
          transaction_id: result.transactionHash,
          odyssey_id: worldId,
          amount: amountAtoms.toString(),
          wallet: selectedWalletId,
          comment,
          kind: '1' // temp
        });
      }

      toast.info(
        <ToastContent
          icon="alert"
          text="Your transaction has been processed. You have successfully staked into another odyssey!"
        />
      );
    } catch (err) {
      console.log('stake error', err);
      toast.error(
        <ToastContent
          isDanger
          icon="alert"
          text="Your transaction was not processed. You were unable to successfully stake into another odyssey, please try again."
        />
      );
    } finally {
      handleOnClose();
    }
  };

  const stepList: StepInterface<StepsType>[] = useMemo(
    () => [
      {id: 'wallet', label: '1', variant: activeStep === 'wallet' ? 'active' : 'prev'},
      {id: 'authorize', label: '2', variant: activeStep === 'authorize' ? 'active' : 'next'}
    ],
    [activeStep]
  );

  return (
    <styled.Container data-testid="StakingWidget-test">
      <Panel
        isFullHeight
        size="normal"
        icon="stake"
        variant="primary"
        title={t('staking.label')}
        onClose={handleOnClose}
      >
        <styled.Steps>
          <Steps stepList={stepList} />
        </styled.Steps>

        <styled.WordContainer>
          <ProfileImage image={world2dStore?.image} imageErrorIcon="rabbit_fill" />
          <styled.WorldName>{worldName}</styled.WorldName>
        </styled.WordContainer>

        <styled.ScrollableContainer>
          {activeStep === 'wallet' && (
            <StakeAmount
              worldName={worldNameWithHash}
              amountValue={amountString}
              amountPrecisionDigits={AMOUNT_PRECISION_DIGITS}
              walletOptions={nftStore.walletOptions}
              walletSelectContent={walletSelectContent}
              selectedWalletId={nftStore.selectedWalletId}
              balanceTransferrable={nftStore.balanceTransferrable}
              tokenSymbol={nftStore.tokenSymbol}
              isNextDisabled={!amountString || isBalanceTooLow || !isBlockchainReady}
              onSelectWalletId={nftStore.setSelectedWalletId}
              onChangeAmountValue={setAmountString}
              onNextClick={() => setActiveStep('authorize')}
            />
          )}

          {activeStep === 'authorize' && (
            <StakeAuthorize
              worldName={worldNameWithHash}
              amountValue={amountString}
              tokenSymbol={nftStore.tokenSymbol}
              selectedWalletId={nftStore.selectedWalletId}
              onChangeAmountValue={setAmountString}
              onStakeClick={onStake}
              onBackClick={() => setActiveStep('wallet')}
            />
          )}
        </styled.ScrollableContainer>
      </Panel>
    </styled.Container>
  );
};

export default observer(StakingWidget);
