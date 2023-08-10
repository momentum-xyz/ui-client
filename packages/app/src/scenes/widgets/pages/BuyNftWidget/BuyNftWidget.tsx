import {FC, useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Button,
  ImageSizeEnum,
  Input,
  ItemCard,
  Panel,
  PositionEnum,
  ProgressBar,
  Select,
  Steps,
  SymbolAmount,
  Warning
} from '@momentum-xyz/ui-kit';
import {BN} from 'bn.js';

import {useBlockchain, useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {ethersToWei, formatBigInt, getImageAbsoluteUrl} from 'core/utils';
import {appVariables} from 'api/constants';
import {WorldInfoInterface} from 'api';

import * as styled from './BuyNftWidget.styled';

const TIMEOUT_WAIT_NFT_MINT = 60_000;

const BuyNftWidget: FC = () => {
  const {widgetManagerStore, sessionStore, nftStore} = useStore();

  const {user} = sessionStore;

  const {selectedWalletId, walletOptions, selectedWallet, setSelectedWalletId} = nftStore;
  const requiredAccountAddress = selectedWalletId || 'n/a';
  console.log('BuyNftWidget', {requiredAccountAddress});
  const {isBlockchainReady, walletSelectContent, sendEthers, getBalanceEthers} = useBlockchain({
    // requiredChainId: 1,
    // wrongChainErrorMessage: 'Please switch to Ethereum Mainnet in the wallet',
    requiredAccountAddress
  });

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  const [currentState, setCurrentState] = useState<
    'init' | 'sending_eth' | 'waiting_nft' | 'ready' | 'error'
  >('init');
  const isStep1 = ['init', 'sending_eth', 'waiting_nft', 'error'].includes(currentState);
  const isStep2 = 'ready' === currentState;
  const inProgress = ['sending_eth', 'waiting_nft'].includes(currentState);
  const isError = 'error' === currentState;

  const refOwnedWorldIds = useRef<string[]>([]);
  const [mintedWorld, setMintedWorld] = useState<WorldInfoInterface | null>(null);

  const [balance, setBalance] = useState<string>();
  useEffect(() => {
    if (!isBlockchainReady) {
      return;
    }
    getBalanceEthers()
      .then((result) => {
        console.log('getBalanceEthers', result);
        setBalance(result);
      })
      .catch((error) => {
        console.log('getBalanceEthers', error);
      });
  }, [isBlockchainReady, requiredAccountAddress, getBalanceEthers]);

  const {MINT_NFT_AMOUNT, MINT_NFT_DEPOSIT_ADDRESS} = appVariables;
  const price = ethersToWei(MINT_NFT_AMOUNT);
  const isEnoughBalance = new BN(balance || '0').gte(price);
  console.log('[BuyNftWidget]', {
    currentState,
    MINT_NFT_AMOUNT,
    price,
    balance,
    isEnoughBalance
  });

  const handleBuy = () => {
    console.log('[BuyNftWidget] handleBuy');
    if (!isEnoughBalance) {
      console.log('[BuyNftWidget] Not enough balance');
      return;
    }

    setCurrentState('sending_eth');

    refOwnedWorldIds.current = sessionStore.worldsOwnedList?.map((w) => w.id) || [];

    sendEthers(MINT_NFT_DEPOSIT_ADDRESS, price)
      .then((result) => {
        console.log('[BuyNftWidget] sendEthers', result);
        const txHash = result?.hash;
        setCurrentState('waiting_nft');
        console.log('[BuyNftWidget] TODO send txHash to BE', txHash);
        // TODO send txHash to BE when it's supported
        // nftStore.postPendingNftMint({transaction_id: txHash, wallet: selectedWalletId});
      })
      .then(() =>
        Promise.race([
          new Promise<void>((resolve) => setTimeout(resolve, TIMEOUT_WAIT_NFT_MINT)),
          new Promise<WorldInfoInterface>((resolve) => {
            const interval = setInterval(async () => {
              try {
                const ownedWorlds = await sessionStore.loadOwnWorlds();
                for (const world of ownedWorlds) {
                  if (!refOwnedWorldIds.current.includes(world.id)) {
                    console.log('[BuyNftWidget] NFT is minted', world);
                    clearInterval(interval);
                    resolve(world);
                    return;
                  }
                }
              } catch (error) {
                console.log('[BuyNftWidget] Error fetching owned worlds', error);
              }
            }, 1000);
          })
        ])
      )
      .then((world) => {
        console.log('[BuyNftWidget] created world:', world);
        if (!world) {
          throw new Error('[BuyNftWidget] NFT buy failed');
        }
        setMintedWorld(world);
        setCurrentState('ready');
      })
      .catch((error) => {
        console.log('[BuyNftWidget] error:', error);
        setCurrentState('error');
      });
  };

  const onInfoClick = (id: string) => {
    widgetManagerStore.open(WidgetEnum.WORLD_DETAILS, PositionEnum.LEFT, {id});
  };

  if (!user || user.isGuest) {
    return <></>;
  }

  return (
    <Panel
      size="normal"
      variant="primary"
      isFullHeight
      // isScrollDisabled
      icon="rabbit_fill"
      title={t('labels.getYourOdyssey')}
      onClose={() => widgetManagerStore.close(WidgetEnum.BUY_NFT)}
    >
      <styled.Wrapper>
        <styled.Steps>
          <Steps
            stepList={[
              {id: '1', label: '1', variant: isStep1 ? 'active' : 'prev'},
              {id: '2', label: '2', variant: isStep2 ? 'active' : 'next'}
            ]}
          />
        </styled.Steps>

        {isStep1 && (
          <>
            <styled.Title>{t('labels.getYourOdysseyTitle')}</styled.Title>
            <styled.Description>{t('labels.getYourOdysseyDescription')}</styled.Description>

            <styled.Separator />

            <styled.Form>
              <styled.Section>
                <styled.Title2>{t('labels.memberProfile')}</styled.Title2>
                <Input wide value={user.name} disabled onChange={() => {}} />
              </styled.Section>

              <styled.Section>
                <styled.Title2>{t('labels.yourWallet')}</styled.Title2>

                {walletSelectContent}

                <styled.WalletInfo>
                  <div>{t('labels.account')}</div>
                  <Select
                    wide
                    options={walletOptions}
                    value={selectedWallet?.wallet_id}
                    placeholder={t('actions.selectWallet')}
                    onSingleChange={setSelectedWalletId}
                  />

                  <div>{t('labels.balance')}</div>
                  <SymbolAmount stringValue={formatBigInt(balance)} tokenSymbol="ETH" />

                  <div>{t('labels.price')}</div>
                  <SymbolAmount stringValue={appVariables.MINT_NFT_AMOUNT} tokenSymbol="ETH" />
                </styled.WalletInfo>
              </styled.Section>

              <Button
                label={t('actions.buyNft')}
                icon="rabbit"
                variant="primary"
                wide
                disabled={!isBlockchainReady || !isEnoughBalance || inProgress}
                onClick={handleBuy}
              />

              {inProgress && (
                <>
                  <styled.Separator />
                  <styled.Warning>{t('labels.waitDontClose')}</styled.Warning>
                  {currentState === 'waiting_nft' && (
                    <styled.ProgressWrapper>
                      <ProgressBar withLogo simulateProgress />
                    </styled.ProgressWrapper>
                  )}
                </>
              )}

              {isError && <Warning message={t('messages.errorBuyingNft')} />}
            </styled.Form>
          </>
        )}

        {isStep2 && !!mintedWorld && (
          <>
            <styled.Title>{t('labels.odysseyMintedTitle')}</styled.Title>
            <styled.Description>{t('labels.odysseyMintedDescription')}</styled.Description>

            <styled.Separator />

            <ItemCard
              variant="small"
              name={mintedWorld.name}
              imageHeight={95}
              description={mintedWorld.description}
              imageErrorIcon="rabbit_fill"
              imageUrl={getImageAbsoluteUrl(mintedWorld.avatarHash, ImageSizeEnum.S5)}
              onVisitClick={() => goToOdysseyHome(mintedWorld.id)}
              onInfoClick={() => onInfoClick(mintedWorld.id)}
            />
            <styled.Separator />

            <styled.Description>{t('labels.odysseyMintedDescription2')}</styled.Description>

            <Button
              label={t('actions.visitYourOdyssey')}
              icon="rabbit"
              variant="primary"
              wide
              onClick={() => goToOdysseyHome(mintedWorld.id)}
            />
          </>
        )}
      </styled.Wrapper>
    </Panel>
  );
};

export default observer(BuyNftWidget);
