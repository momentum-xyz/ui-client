import {FC} from 'react';
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
import {useBlockchain} from 'shared/hooks';

import * as styled from './MyWallet.styled';

interface PropsInterface {
  walletOptions: SelectOptionInterface<string>[];
  onSelectWallet: (walletId: string | null) => void;
  selectedWallet?: WalletModelInterface;
}

const MyWallet: FC<PropsInterface> = ({walletOptions, selectedWallet, onSelectWallet}) => {
  const {t} = useI18n();

  const requiredAccountAddress = selectedWallet?.wallet_id || 'n/a';
  console.log('MyWallet', {selectedWallet, requiredAccountAddress});

  const {isBlockchainReady, walletSelectContent, claimRewards, getTokens} = useBlockchain({
    requiredAccountAddress
  });

  const handleAirdrop = async () => {
    try {
      await getTokens();
      console.log('Airdop success');
    } catch (err) {
      console.log('Error requesting airdrop:', err);
    }
  };

  const handleClaimRewards = async () => {
    try {
      await claimRewards();
      console.log('Claim rewards success');
    } catch (err) {
      console.log('Error claiming rewards:', err);
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
            onSingleChange={onSelectWallet}
          />
        </styled.Filters>

        {walletSelectContent}

        <styled.Title>{t('labels.rewards')}</styled.Title>
        <styled.RewardsContainer>
          <span>{t('labels.totalRewards')}</span>
          <styled.Amount>
            <SymbolAmount tokenSymbol="MOM" stringValue={formatBigInt(selectedWallet?.reward)} />
          </styled.Amount>
          <Button
            icon="wallet"
            label={t('actions.claimRewards')}
            disabled={!isBlockchainReady}
            onClick={handleClaimRewards}
          />
        </styled.RewardsContainer>

        <styled.Title>{t('actions.requestAirdropTokens')}</styled.Title>
        <styled.AirdropContainer>
          <span>Lorem ipsum dolor sit amet, ligula consectetuer adipiscing elit.</span>
          <Button
            icon="air"
            label={t('actions.startAirdrop')}
            disabled={!isBlockchainReady}
            onClick={handleAirdrop}
          />
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
