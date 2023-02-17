import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {SignUpFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {CreateOdysseyForm, ChoiceYourWallet} from './components';
import * as styled from './SignInAccountPage.styled';

const SignInAccountPage: FC = () => {
  const {nftStore, signInStore} = useStore();
  const {balanceTotal, isZeroBalance, isBalanceLoading, tokenSymbol} = nftStore;
  const {requestingFundsStatus, mintingNftStatus} = nftStore;

  const [walletWithFundsIsConnected, setWalletWithFundsIsConnected] = useState(false);

  const accountSelectedAndFundsAquired =
    walletWithFundsIsConnected || requestingFundsStatus === 'success';

  const {t} = useTranslation();

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

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          {!accountSelectedAndFundsAquired && (
            <>
              <SinusBox />
              <ChoiceYourWallet
                walletOptions={nftStore.accountsWithoutNftsOptions}
                wallet={signInStore.wallet}
                isConnectDisabled={requestingFundsStatus === 'pending' || isBalanceLoading}
                onSelectAddress={signInStore.selectWallet}
                onConnect={onConnectWallet}
              />
            </>
          )}

          {requestingFundsStatus === 'pending' && (
            <styled.MintingMessageBox>
              <Text text={t('messages.loadingToken', {tokenSymbol})} size="m" align="left" />
            </styled.MintingMessageBox>
          )}

          {requestingFundsStatus === 'error' && (
            <styled.MintingMessageBox>
              <Text text={t('errors.errorLoadingToken', {tokenSymbol})} size="m" align="left" />
            </styled.MintingMessageBox>
          )}

          {accountSelectedAndFundsAquired && (
            <>
              <SinusBox />
              <CreateOdysseyForm
                fieldErrors={signInStore.fieldErrors}
                isSubmitDisabled={signInStore.isUpdating || mintingNftStatus === 'pending'}
                onSubmit={handleSubmit}
              />
            </>
          )}

          {mintingNftStatus === 'pending' && (
            <styled.MintingMessageBox>
              <Text text={t('messages.mintingYourOdyssey')} size="m" align="left" />
              <Text text={t('messages.mintingYourOdysseyWarning')} size="m" align="left" />
            </styled.MintingMessageBox>
          )}

          {mintingNftStatus === 'error' && (
            <styled.MintingMessageBox>
              <Text text={t('errors.errorLoadingNFT')} size="m" align="left" />
            </styled.MintingMessageBox>
          )}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInAccountPage);
