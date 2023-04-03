import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {Text} from '@momentum-xyz/ui-kit';
import {Panel, Hexagon, FrameSteps, StepInterface} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {ROUTES} from 'core/constants';
import {SignUpFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';

import {CreateOdysseyForm, ChoiceYourWallet, Loader} from './components';
import * as styled from './SignInAccountPage.styled';

const SignInAccountPage: FC = () => {
  const {nftStore, signInStore} = useStore();
  const {balanceTotal, isZeroBalance, isBalanceLoading} = nftStore;
  const {requestingFundsStatus, mintingNftStatus} = nftStore;

  const [walletWithFundsIsConnected, setWalletWithFundsIsConnected] = useState(false);

  const accountSelectedAndFundsAcquired =
    walletWithFundsIsConnected || requestingFundsStatus === 'success';

  const {t} = useI18n();

  const navigate = useNavigate();

  console.log('SignInAccountPage', {
    balanceTotal,
    isZeroBalance,
    walletWithFundsIsConnected,
    isBalanceLoading,
    requestingFundsStatus,
    mintingNftStatus
  });

  const onConnectWallet = useCallback(() => {
    console.log('onConnectWallet', {isZeroBalance});
    if (isZeroBalance) {
      nftStore.requestAirdrop(signInStore.wallet);
    } else {
      // there are funds already
      setWalletWithFundsIsConnected(true);
    }
  }, [signInStore.wallet, isZeroBalance, nftStore]);

  const onSelectWallet = useCallback(
    (wallet: string) => {
      signInStore.selectWallet(wallet);
      return nftStore.subscribeToBalanceChanges(wallet);
    },
    [nftStore, signInStore]
  );

  const handleSubmit = useCallback(
    async (form: SignUpFormInterface) => {
      try {
        const avatarHash = await signInStore.getAvatarHash(form);

        console.log(`Minting for ${form.name} ${avatarHash}`);
        const userID = await nftStore.mintNft(signInStore.wallet, form.name || '', avatarHash);
        console.log('Minting is successful! userID:', userID);

        // NFT should be minted and accessible by now - if it doesn't happen sometimes
        // we can put some wait here
        await nftStore.fetchNfts();
        navigate(ROUTES.birth);
      } catch (err) {
        console.log('error minting nft', err);
      }
    },
    [navigate, nftStore, signInStore]
  );

  const activeStep = accountSelectedAndFundsAcquired ? 1 : 0;
  const stepList: StepInterface[] = [
    {label: '1', variant: activeStep === 0 ? 'active' : 'prev'},
    {label: '2', variant: activeStep === 0 ? 'next' : 'active'}
  ];

  const innerItem = (
    <>
      {!accountSelectedAndFundsAcquired && requestingFundsStatus !== 'pending' && (
        <>
          <ChoiceYourWallet
            hasError={requestingFundsStatus === 'error'}
            walletOptions={nftStore.accountsWithoutNftsOptions}
            wallet={signInStore.wallet}
            isConnectDisabled={requestingFundsStatus === 'pending' || isBalanceLoading}
            onSelectAddress={onSelectWallet}
            onConnect={onConnectWallet}
          />
        </>
      )}

      {requestingFundsStatus === 'pending' && <Loader />}

      {accountSelectedAndFundsAcquired && mintingNftStatus !== 'pending' && (
        <>
          <CreateOdysseyForm
            fieldErrors={signInStore.fieldErrors}
            isSubmitDisabled={signInStore.isUpdating || mintingNftStatus === 'pending'}
            onSubmit={handleSubmit}
          />
        </>
      )}

      {mintingNftStatus === 'pending' && (
        <Loader
          title={t('messages.mintingYourOdyssey')}
          line={t('messages.mintingYourOdysseyWarning')}
        />
      )}

      {mintingNftStatus === 'error' && (
        <styled.MintingMessageBox>
          <Text text={t('errors.errorLoadingNFT')} size="m" align="left" />
        </styled.MintingMessageBox>
      )}
    </>
  );

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <Panel
            title="Create account"
            variant="primary"
            hexagon={<Hexagon type="secondary-borderless" iconName="astronaut" />}
          >
            <FrameSteps stepList={stepList}>{innerItem}</FrameSteps>
          </Panel>
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInAccountPage);
