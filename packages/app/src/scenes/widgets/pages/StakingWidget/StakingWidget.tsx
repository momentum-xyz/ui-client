import {FC, useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import BN from 'bn.js';
import {useI18n} from '@momentum-xyz/core';
import {Panel, StepInterface, Steps} from '@momentum-xyz/ui-kit-storybook';

import {ProfileImage, ToastContent} from 'ui-kit';
import {WidgetEnum} from 'core/enums';
import {useBlockchain, useStore} from 'shared/hooks';
import {WidgetInfoModelInterface} from 'stores/WidgetManagerStore';

import {StakeAmount, StakeAuthorize} from './components';
import * as styled from './StakingWidget.styled';

type StepsType = 'wallet' | 'authorize';
const DEFAULT_STAKING_AMOUNT = 1;

const StakingWidget: FC<WidgetInfoModelInterface> = ({data}) => {
  const {widgetManagerStore, nftStore, universeStore} = useStore();
  const {selectedWalletId, canBeStaked, addresses, chainDecimals} = nftStore;
  const {world2dStore} = universeStore;

  const [activeStep, setActiveStep] = useState<StepsType>('wallet');

  const {t} = useI18n();

  const {isBlockchainReady, walletSelectContent, account, stake} = useBlockchain({
    requiredAccountAddress: selectedWalletId
  });

  console.log('StakeForm useStaking', {isBlockchainReady, account, stake});

  const [amountString, setAmountString] = useState(DEFAULT_STAKING_AMOUNT.toString());
  const amountStringValueCheckRegex = /^\d{1,12}((\.|,)\d{0,4})?$/;

  const nftId = data?.id || universeStore.worldId;
  // this allows us to use decimals while also validating with BN
  const amountAtoms = new BN(+amountString * 1_000).mul(new BN(Math.pow(10, chainDecimals - 3)));
  const isBalanceTooLow = !canBeStaked(amountAtoms);

  const validStringCheck = (val: string): boolean => !val || amountStringValueCheckRegex.test(val);
  const onStakeAmountInput = (val: string) => {
    if (!validStringCheck(val)) {
      return;
    }
    setAmountString(val);
  };

  console.log('StakingForm', {selectedWalletId, addresses, amountString, amountAtoms});

  const handleOnClose = () => {
    widgetManagerStore.close(WidgetEnum.STAKING);
  };

  const onStake = async () => {
    try {
      console.log('onStake', nftStore.selectedWalletId, nftId, amountAtoms);
      await stake(nftId as string, amountAtoms);
      console.log('stake success');

      toast.info(
        <ToastContent
          icon="alert"
          text={t('staking.stakeSuccess', {
            amount: amountString,
            name: 'nft?.name'
          })}
        />
      );
    } catch (err) {
      console.log('stake error', err);
      toast.error(<ToastContent icon="alert" isDanger text={t('staking.error')} />);
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
          <styled.WorldName>{world2dStore?.worldDetails?.world?.name}</styled.WorldName>
        </styled.WordContainer>

        <styled.ScrollableContainer>
          {activeStep === 'wallet' && (
            <StakeAmount
              amountValue={amountString}
              walletOptions={nftStore.walletOptions}
              walletSelectContent={walletSelectContent}
              selectedWalletId={nftStore.selectedWalletId}
              balanceTransferrable={nftStore.balanceTransferrable}
              tokenSymbol={nftStore.tokenSymbol}
              isNextDisabled={!amountString || isBalanceTooLow || !isBlockchainReady}
              onSelectWalletId={nftStore.setSelectedWalletId}
              onChangeAmountValue={onStakeAmountInput}
              onNextClick={() => setActiveStep('authorize')}
            />
          )}

          {activeStep === 'authorize' && (
            <StakeAuthorize
              amountValue={amountString}
              tokenSymbol={nftStore.tokenSymbol}
              onChangeAmountValue={onStakeAmountInput}
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
