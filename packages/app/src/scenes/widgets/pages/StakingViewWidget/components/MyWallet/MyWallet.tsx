import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Frame,
  Select,
  SymbolAmount,
  Button,
  SelectOptionInterface
} from '@momentum-xyz/ui-kit-storybook';

import {WalletModelInterface} from 'core/models';

import * as styled from './MyWallet.styled';

interface PropsInterface {
  wallets: WalletModelInterface[];
  walletOptions: SelectOptionInterface<string>[];
}

const DECIMAL_SCALE = 2;

const MyWallet: FC<PropsInterface> = ({wallets, walletOptions}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletModelInterface>();

  const {t} = useI18n();

  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0]);
    }
  }, [selectedWallet, wallets, wallets.length]);

  return (
    <styled.Wrapper data-testid="MyWallet-test">
      <Frame>
        <styled.Title>{t('labels.myWallet')}</styled.Title>

        <styled.Filters>
          <div>{t('labels.account')}</div>
          <Select
            wide
            options={walletOptions}
            value={selectedWallet?.hash}
            placeholder={t('actions.selectWallet')}
            onSingleChange={(hash) => {
              const wallet = wallets.find((i) => i.hash === hash);
              if (wallet) {
                setSelectedWallet(wallet);
              }
            }}
          />
        </styled.Filters>

        <styled.Title>{t('labels.rewards')}</styled.Title>

        <styled.RewardsContainer>
          <span>{t('labels.totalRewards')}</span>
          <styled.Amount>
            <SymbolAmount
              value={selectedWallet?.rewardsAmount}
              tokenSymbol={selectedWallet?.symbol}
              decimalScale={DECIMAL_SCALE}
            />
          </styled.Amount>
          <Button icon="wallet" label={t('actions.claimRewards')} />
        </styled.RewardsContainer>

        <styled.ScrollableContainer>
          <styled.Title>{t('labels.balance')}</styled.Title>

          <styled.TokenBlock>
            <styled.TitleBlock>{t('labels.accountBalance')}</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount
                  value={selectedWallet?.balanceAmount}
                  tokenSymbol={selectedWallet?.symbol}
                  decimalScale={DECIMAL_SCALE}
                />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>

          <styled.TokenBlock>
            <styled.TitleBlock>{t('labels.transferable')}</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount
                  value={selectedWallet?.transferableAmount}
                  tokenSymbol={selectedWallet?.symbol}
                  decimalScale={DECIMAL_SCALE}
                />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>

          <styled.TokenBlock>
            <styled.TitleBlock>{t('labels.staked')}</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount
                  value={selectedWallet?.stakedAmount}
                  tokenSymbol={selectedWallet?.symbol}
                  decimalScale={DECIMAL_SCALE}
                />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>

          <styled.TokenBlock>
            <styled.TitleBlock>{t('labels.unbonding')}</styled.TitleBlock>
            <styled.TokenBlockData>
              <span>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
                dolor. Aenean commodo ligula eget dolor...
              </span>
              <styled.Amount>
                <SymbolAmount
                  value={selectedWallet?.unbondingAmount}
                  tokenSymbol={selectedWallet?.symbol}
                  decimalScale={DECIMAL_SCALE}
                />
              </styled.Amount>
            </styled.TokenBlockData>
          </styled.TokenBlock>
        </styled.ScrollableContainer>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(MyWallet);
