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

import {formatBigInt} from 'core/utils';
import {WalletModelInterface} from 'core/models';
import {useBlockchainAirdrop} from 'shared/hooks/useBlockchainAirdrop';
import {SignIn} from 'scenes/widgets/pages/LoginWidget/components';

import * as styled from './MyWallet.styled';

interface PropsInterface {
  wallets: WalletModelInterface[];
  walletOptions: SelectOptionInterface<string>[];
}

const MyWallet: FC<PropsInterface> = ({wallets, walletOptions}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletModelInterface>();

  const {t} = useI18n();

  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0]);
    }
  }, [selectedWallet, wallets, wallets.length]);

  const {isWalletActive, getTokens} = useBlockchainAirdrop();

  const handleAirdrop = async () => {
    try {
      const tokens = await getTokens();
      console.log(tokens);
    } catch (err) {
      console.log('Error requesting airdrop:', err);
    }
  };

  return (
    <styled.Wrapper data-testid="MyWallet-test">
      <Frame>
        <styled.Title>{t('labels.myWallet')}</styled.Title>

        <styled.Filters>
          <div>{t('labels.account')}</div>
          <Select
            wide
            options={walletOptions}
            value={selectedWallet?.wallet_id}
            placeholder={t('actions.selectWallet')}
            onSingleChange={(wallet_id) => {
              const wallet = wallets.find((i) => i.wallet_id === wallet_id);
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
            <SymbolAmount tokenSymbol="MOM" stringValue={formatBigInt(selectedWallet?.reward)} />
          </styled.Amount>
          <Button icon="wallet" label={t('actions.claimRewards')} />
        </styled.RewardsContainer>

        <styled.Title>{t('actions.requestAirdropTokens')}</styled.Title>
        <styled.AirdropContainer>
          <span>Lorem ipsum dolor sit amet, ligula consectetuer adipiscing elit.</span>
          {isWalletActive ? (
            <Button icon="air" label={t('actions.startAirdrop')} onClick={handleAirdrop} />
          ) : (
            // TODO will be done automatically
            <SignIn />
          )}
        </styled.AirdropContainer>

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
                  tokenSymbol="MOM"
                  stringValue={formatBigInt(selectedWallet?.balance)}
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
                  tokenSymbol="MOM"
                  stringValue={formatBigInt(selectedWallet?.transferable)}
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
                  tokenSymbol="MOM"
                  stringValue={formatBigInt(selectedWallet?.staked)}
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
                  tokenSymbol="MOM"
                  stringValue={formatBigInt(selectedWallet?.unbonding)}
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
