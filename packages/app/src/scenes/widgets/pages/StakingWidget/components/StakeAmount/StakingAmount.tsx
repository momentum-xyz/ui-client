import {FC, ReactNode} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Heading, Input, Text} from '@momentum-xyz/ui-kit';
import {Button, Select, SelectOptionInterface} from '@momentum-xyz/ui-kit-storybook';

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
    <styled.Container>
      <styled.TabContent>
        <div>
          <styled.Section>
            <styled.SectionHeader>
              <Heading type="h2" align="left" label={t('staking.walletAccount')} />
            </styled.SectionHeader>
            <styled.LabeledLineContainer>
              <styled.Filters>
                <div>{t('labels.account')}</div>
                <Select
                  wide
                  options={walletOptions}
                  value={selectedWalletId}
                  placeholder={t('actions.selectWallet')}
                  onSingleChange={onSelectWalletId}
                />
              </styled.Filters>
            </styled.LabeledLineContainer>
            {walletSelectContent}
          </styled.Section>

          <styled.Section>
            <styled.SectionHeader>
              <Heading type="h2" align="left" label={t('staking.balance')} />
            </styled.SectionHeader>
            <styled.BalanceContainer>
              <styled.BalanceEntityContainer>
                <Heading type="h4" align="left" label={t('staking.balanceTypes.transferable')} />
                <Text size="xxs" align="left" text={balanceTransferrable} />
              </styled.BalanceEntityContainer>
            </styled.BalanceContainer>
          </styled.Section>
          <styled.Separator />
          <styled.Section>
            <styled.SectionHeader>
              <Heading type="h2" align="left" label={t('staking.startContributing')} />
            </styled.SectionHeader>
            <styled.LabeledLineContainer>
              <styled.LabeledLineLabelContainer>
                <Text
                  size="xxs"
                  align="right"
                  text={t('staking.setAmountSymbol', {symbol: tokenSymbol})}
                />
              </styled.LabeledLineLabelContainer>
              <styled.LabeledLineInputContainer>
                <Input autoFocus value={amountValue} onChange={onChangeAmountValue} />
              </styled.LabeledLineInputContainer>
            </styled.LabeledLineContainer>
            <styled.LabeledLineContainer>
              <styled.LabeledLineLabelContainer>
                <Text size="xxs" align="right" text={t('staking.destination')} />
              </styled.LabeledLineLabelContainer>
            </styled.LabeledLineContainer>
          </styled.Section>
        </div>

        <styled.Buttons>
          <Button label={t('staking.next')} onClick={onNextClick} disabled={isNextDisabled} />
        </styled.Buttons>
      </styled.TabContent>
    </styled.Container>
  );
};

export default observer(StakingAmount);
