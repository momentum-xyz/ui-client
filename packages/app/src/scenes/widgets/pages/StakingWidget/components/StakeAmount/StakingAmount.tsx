import {FC, ReactNode} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, Select, Input, SelectOptionInterface} from '@momentum-xyz/ui-kit-storybook';

import * as styled from './StakeAmount.styled';

interface PropsInterface {
  amountValue: string;
  isNextDisabled: boolean;
  walletOptions: SelectOptionInterface<string>[];
  walletSelectContent: ReactNode;
  selectedWalletId: string | null;
  balanceTransferrable: string;
  tokenSymbol: string;
  onSelectWalletId: (wallet: string | null) => void;
  onChangeAmountValue: (value: string) => void;
  onNextClick: () => void;
}

const StakingAmount: FC<PropsInterface> = ({
  amountValue,
  isNextDisabled,
  walletOptions,
  walletSelectContent,
  selectedWalletId,
  balanceTransferrable,
  tokenSymbol,
  onSelectWalletId,
  onChangeAmountValue,
  onNextClick
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="StakingAmount-test">
      <styled.Title>Start Staking</styled.Title>
      <styled.Description>
        By staking Momentum (${tokenSymbol}) in an Odyssey you invest in this creation and endorse
        the journey. You’ll receive a reward, after-all their success is your success.
      </styled.Description>

      {/* My wallet */}
      <styled.Section>
        <div>My wallet</div>
        <styled.SectionGrid>
          <div>{t('labels.account')}</div>
          <Select
            wide
            options={walletOptions}
            value={selectedWalletId}
            placeholder={t('actions.selectWallet')}
            onSingleChange={onSelectWalletId}
          />
        </styled.SectionGrid>
        {walletSelectContent}
      </styled.Section>

      {/* Balance */}
      <styled.Section>
        <div>{t('staking.balance')}</div>
        <styled.SectionGrid>
          <div>{t('staking.balanceTypes.transferable')}</div>
          <Input value={balanceTransferrable} disabled onChange={() => {}} wide />
        </styled.SectionGrid>
      </styled.Section>

      {/* Start Staking */}
      <styled.Section>
        <div>Start Staking</div>
        <styled.SectionGrid>
          <div>Set Amount</div>
          <Input value={amountValue} onChange={onChangeAmountValue} wide />
        </styled.SectionGrid>

        <styled.SectionGrid>
          <div>Odyssey</div>
          <styled.OdysseyName>
            <span>Odyssey Name Odyssey Name</span>
          </styled.OdysseyName>
        </styled.SectionGrid>
      </styled.Section>

      <styled.Buttons>
        <Button label={t('actions.nextStep')} onClick={onNextClick} disabled={isNextDisabled} />
      </styled.Buttons>
    </styled.Container>
  );
};

export default observer(StakingAmount);
