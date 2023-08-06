/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, Frame, Panel, Select, Steps, SymbolAmount} from '@momentum-xyz/ui-kit';
import {BN} from 'bn.js';

import {useBlockchain, useNavigation, useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {appVariables} from 'api/constants';

import {SignIn} from '../LoginWidget/components';

import * as styled from './BuyNftWidget.styled';

const BuyNftWidget: FC = () => {
  const {widgetManagerStore, widgetStore, sessionStore, universeStore, nftStore} = useStore();
  // const {worldId} = universeStore;

  const {user} = sessionStore;

  const {selectedWalletId, chainDecimals, walletOptions, selectedWallet, setSelectedWalletId} =
    nftStore;
  const requiredAccountAddress = selectedWalletId || 'n/a';
  console.log('BuyNftWidget', {requiredAccountAddress});
  const {isBlockchainReady, walletSelectContent, sendEthers} = useBlockchain({
    // requiredChainId: 1,
    // wrongChainErrorMessage: 'Please switch to Ethereum Mainnet in the wallet',
    requiredAccountAddress
  });

  const isFinished = true;

  const {t} = useI18n();
  const {goToOdysseyHome} = useNavigation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onBuy = () => {
    console.log('onBuy');
    const {MINT_NFT_AMOUNT, MINT_NFT_DEPOSIT_ADDRESS} = appVariables;
    const MULT = 8;
    const _amount = parseFloat(MINT_NFT_AMOUNT) * Math.pow(10, chainDecimals - MULT);
    const amount = new BN(String(_amount)).mul(new BN(10).pow(new BN(MULT)));
    console.log('onBuy', {
      amount,
      amountStr: amount.toString(),
      _amount,
      chainDecimals,
      MULT,
      MINT_NFT_AMOUNT
    });
    sendEthers(MINT_NFT_DEPOSIT_ADDRESS, amount)
      .then((result) => {
        console.log('onBuy', result);
        // goToOdysseyHome();
      })
      .catch((error) => {
        console.log('onBuy', error);
      });
  };

  if (!user) {
    return <></>;
  }

  return (
    // <styled.Container data-testid="BuyNftWidget-test">
    <Panel
      size="normal"
      isFullHeight
      isScrollDisabled
      variant="primary"
      icon="rabbit_fill"
      title={t('labels.getYourOdyssey')}
      onClose={() => widgetManagerStore.close(WidgetEnum.BUY_NFT)}
    >
      <styled.Wrapper>
        {/* <Frame> */}
        <styled.Steps>
          <Steps
            stepList={[
              {id: '1', label: '1', variant: !isFinished ? 'active' : 'prev'},
              {id: '2', label: '2', variant: isFinished ? 'active' : 'next'}
            ]}
          />
        </styled.Steps>
        <styled.Title>{t('labels.getYourOdysseyTitle')}</styled.Title>
        <styled.Description>{t('labels.getYourOdysseyDescription')}</styled.Description>

        {/* <styled.Separator /> */}

        {user.isGuest ? (
          <SignIn headless />
        ) : (
          <styled.BuyForm>
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

              <div>{t('labels.price')}</div>
              {/* <Input wide value={appVariables.MINT_NFT_AMOUNT} disabled onChange={() => {}} /> */}
              <SymbolAmount stringValue={appVariables.MINT_NFT_AMOUNT} tokenSymbol="ETH" />
            </styled.WalletInfo>
            <Button
              label={t('actions.buyNft')}
              icon="rabbit"
              variant="secondary"
              wide
              disabled={!isBlockchainReady}
              onClick={onBuy}
            />
          </styled.BuyForm>
        )}
        <styled.Separator />
        {/* {user.isGuest ? descr : descr2} */}
        {/* </Frame> */}
      </styled.Wrapper>
    </Panel>
    // </styled.Container>
  );
};

export default observer(BuyNftWidget);
