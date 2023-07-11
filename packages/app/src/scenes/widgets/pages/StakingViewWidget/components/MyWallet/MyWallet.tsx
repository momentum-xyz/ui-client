import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Frame, Select, SymbolAmount, Button, SelectOptionInterface} from '@momentum-xyz/ui-kit';

import {formatBigInt} from 'core/utils';
import {WalletModelInterface} from 'core/models';
import {useBlockchain} from 'shared/hooks';
import {TokenSelector} from 'ui-kit';
import {appVariables} from 'api/constants';

import * as styled from './MyWallet.styled';

interface PropsInterface {
  walletOptions: SelectOptionInterface<string>[];
  onSelectWallet: (walletId: string | null) => void;
  selectedWallet?: WalletModelInterface;
  selectedWalletTransferrable: string;
  selectedWalletStaked: string;
  showTokenSelector?: boolean;
  tokenSymbol?: string;
}

const MyWallet: FC<PropsInterface> = ({
  walletOptions,
  selectedWallet,
  selectedWalletTransferrable,
  selectedWalletStaked,
  showTokenSelector,
  tokenSymbol,
  onSelectWallet
}) => {
  const {t} = useI18n();

  const requiredAccountAddress = selectedWallet?.wallet_id || 'n/a';
  console.log('MyWallet', {selectedWallet, requiredAccountAddress});

  const {
    isBlockchainReady,
    walletSelectContent,
    canRequestAirdrop,
    dateOfNextAllowedAirdrop,
    claimRewards,
    getTokens
  } = useBlockchain({
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

          {showTokenSelector && (
            <>
              <div>{t('labels.token')}</div>
              <TokenSelector />
            </>
          )}
        </styled.Filters>

        <div>{walletSelectContent}</div>

        <styled.Title>{t('labels.rewards')}</styled.Title>
        <styled.RewardsContainer>
          <span>{t('labels.totalRewards')}</span>
          <styled.Amount>
            <SymbolAmount
              tokenSymbol={tokenSymbol}
              stringValue={formatBigInt(selectedWallet?.reward)}
            />
          </styled.Amount>
          <Button
            icon="wallet"
            label={t('actions.claimRewards')}
            disabled={!isBlockchainReady}
            onClick={handleClaimRewards}
          />
        </styled.RewardsContainer>

        {!!appVariables.CONTRACT_FAUCET_ADDRESS && (
            <>
              <styled.Title>Use Faucet</styled.Title>
              <styled.AirdropContainer>
                {canRequestAirdrop !== false ? (
                    <>
              <span>
                Get 10k MOM test tokens from the faucet. It can be requested once per day.
              </span>
                      <Button
                          icon="air"
                          label="Use Faucet"
                          disabled={!isBlockchainReady}
                          onClick={handleAirdrop}
                      />
                    </>
                ) : (
                    <>
                      <span>You can make another request tomorrow at {dateOfNextAllowedAirdrop}</span>
                    </>
                )}
              </styled.AirdropContainer>
            </>
        )}


        <styled.Title>{t('labels.balance')}</styled.Title>

        <styled.TokenBlock>
          <styled.TitleBlock>{t('labels.accountBalance')}</styled.TitleBlock>
          <styled.TokenBlockData>
            <span>Total amount of MOM token in your wallet.</span>
            <styled.Amount>
              <SymbolAmount
                tokenSymbol={tokenSymbol}
                stringValue={formatBigInt(selectedWallet?.balance)}
              />
            </styled.Amount>
          </styled.TokenBlockData>
        </styled.TokenBlock>

        <styled.TokenBlock>
          <styled.TitleBlock>{t('labels.transferable')}</styled.TitleBlock>
          <styled.TokenBlockData>
            <span>Total amount of MOM tokens that can be transferred or used in staking.</span>
            <styled.Amount>
              <SymbolAmount tokenSymbol={tokenSymbol} stringValue={selectedWalletTransferrable} />
            </styled.Amount>
          </styled.TokenBlockData>
        </styled.TokenBlock>

        <styled.TokenBlock>
          <styled.TitleBlock>{t('labels.staked')}</styled.TitleBlock>
          <styled.TokenBlockData>
            <span>Total amount of MOM tokens that are being staked by you.</span>
            <styled.Amount>
              <SymbolAmount tokenSymbol={tokenSymbol} stringValue={selectedWalletStaked} />
            </styled.Amount>
          </styled.TokenBlockData>
        </styled.TokenBlock>

        <styled.TokenBlock>
          <styled.TitleBlock>{t('labels.unbonding')}</styled.TitleBlock>
          <styled.TokenBlockData>
            <span>
              Total amount of MOM tokens that will be available to be redeemed from previous
              unstakings
            </span>
            <styled.Amount>
              <SymbolAmount
                tokenSymbol={tokenSymbol}
                stringValue={formatBigInt(selectedWallet?.unbonding)}
              />
            </styled.Amount>
          </styled.TokenBlockData>
        </styled.TokenBlock>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(MyWallet);
