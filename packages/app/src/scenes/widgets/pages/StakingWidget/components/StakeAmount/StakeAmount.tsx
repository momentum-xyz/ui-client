import {FC, ReactNode} from 'react';
import {observer} from 'mobx-react-lite';
import {TokenEnum, useI18n} from '@momentum-xyz/core';
import {
  Button,
  Select,
  Input,
  SelectOptionInterface,
  numberInputSuffixMask,
  Radio
} from '@momentum-xyz/ui-kit';

import * as styled from './StakeAmount.styled';

const tokenOptions = [
  {value: String(TokenEnum.MOM_TOKEN), label: 'MOM'},
  {value: String(TokenEnum.DAD_TOKEN), label: 'DAD'}
];

interface PropsInterface {
  worldName: string;
  amountValue: string;
  amountPrecisionDigits: number;
  isNextDisabled: boolean;
  walletOptions: SelectOptionInterface<string>[];
  walletSelectContent: ReactNode;
  selectedWalletId: string | null;
  balanceTransferrable: string;
  tokenSymbol: string;
  tokenKind: TokenEnum;
  onSelectWalletId: (wallet: string | null) => void;
  onChangeAmountValue: (value: string) => void;
  onChangeToken: (token: TokenEnum) => void;
  onNextClick: () => void;
}

const StakeAmount: FC<PropsInterface> = ({
  worldName,
  amountValue,
  amountPrecisionDigits,
  isNextDisabled,
  walletOptions,
  walletSelectContent,
  selectedWalletId,
  balanceTransferrable,
  tokenSymbol,
  tokenKind,
  onSelectWalletId,
  onChangeAmountValue,
  onChangeToken,
  onNextClick
}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="StakeAmount-test">
      <styled.Title>Start Staking</styled.Title>
      <styled.Description>
        By staking Momentum (${tokenSymbol}) in an Odyssey you invest in this creation and endorse
        the journey. You’ll receive a reward, after-all their success is your success.
      </styled.Description>

      {/* My wallet */}
      <styled.Section>
        <styled.Name>My wallet</styled.Name>
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

        <styled.WalletContent>{walletSelectContent}</styled.WalletContent>

        <styled.SectionGrid>
          <div>Token</div>
          <Radio
            name="token"
            value={String(tokenKind)}
            options={tokenOptions}
            onChange={(val) => onChangeToken(Number(val))}
          />
        </styled.SectionGrid>
      </styled.Section>

      {/* Balance */}
      <styled.Section>
        <styled.Name>{t('staking.balance')}</styled.Name>
        <styled.SectionGrid>
          <div>{t('staking.balanceTypes.transferable')}</div>
          <styled.BorderedValue>{`${balanceTransferrable} ${tokenSymbol}`}</styled.BorderedValue>
        </styled.SectionGrid>
      </styled.Section>

      {/* Start Staking */}
      <styled.Section>
        <styled.Name>Start Staking</styled.Name>
        <styled.SectionGrid>
          <div>Set Amount</div>
          <Input
            wide
            value={amountValue}
            opts={numberInputSuffixMask(tokenSymbol, amountPrecisionDigits)}
            onChange={onChangeAmountValue}
          />
        </styled.SectionGrid>

        <styled.SectionGrid>
          <styled.Name>Odyssey</styled.Name>
          <styled.BorderedValue>
            <span>{worldName}</span>
          </styled.BorderedValue>
        </styled.SectionGrid>
      </styled.Section>

      <styled.Buttons>
        <Button label={t('actions.nextStep')} onClick={onNextClick} disabled={isNextDisabled} />
      </styled.Buttons>
    </styled.Container>
  );
};

export default observer(StakeAmount);
