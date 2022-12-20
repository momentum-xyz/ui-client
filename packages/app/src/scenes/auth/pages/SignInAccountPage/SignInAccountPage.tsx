import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {SignUpFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {CreateOdysseyForm, ChoiceYourWallet, CongratulationsBox} from './components';
import * as styled from './SignInAccountPage.styled';

const SignInAccountPage: FC = () => {
  const {authStore, nftStore, signInAccountStore} = useStore();
  const {
    balanceTotal,
    isZeroBalance,
    isBalanceLoading,
    tokenSymbol,
    requestAirdrop,
    requestingFundsStatus,
    mintingNftStatus,
    mintNft
  } = nftStore;
  const [walletWithFundsIsConnected, setWalletWithFundsIsConnected] = useState(false);

  const accountSelectedAndFundsAquired =
    walletWithFundsIsConnected || requestingFundsStatus === 'success';

  const {t} = useTranslation();

  useEffect(() => {
    authStore.clear();
  }, [authStore]);

  const history = useHistory();
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
      requestAirdrop(authStore.wallet);
    } else {
      // there are funds already
      setWalletWithFundsIsConnected(true);
    }
  }, [authStore.wallet, isZeroBalance, requestAirdrop]);

  const handleSubmit = useCallback(
    async (form: SignUpFormInterface) => {
      try {
        const avatarHash = await signInAccountStore.getAvatarHash(form);

        console.log(`Minting for ${form.name} ${avatarHash}`);
        const userID = await mintNft(authStore.wallet, form.name || '', avatarHash);
        console.log('Minting is successful! userID:', userID);

        // NFT should be minted and accessible by now - if it doesn't happen sometimes
        // we can put some wait here
        await nftStore.fetchNfts();

        history.push(ROUTES.birth);
      } catch (err) {
        console.log('error minting nft', err);
      }
    },
    [authStore.wallet, history, mintNft, nftStore, signInAccountStore]
  );

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          {!authStore.token && !accountSelectedAndFundsAquired && (
            <>
              <SinusBox />
              <ChoiceYourWallet
                walletOptions={nftStore.accountsWithoutNftsOptions}
                wallet={authStore.wallet}
                isConnectDisabled={
                  authStore.isPending || requestingFundsStatus === 'pending' || isBalanceLoading
                }
                onSelectAddress={authStore.activateWallet}
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
              {requestingFundsStatus === 'success' && mintingNftStatus !== 'pending' && (
                <CongratulationsBox amount={balanceTotal} />
              )}
              <SinusBox />
              <CreateOdysseyForm
                fieldErrors={signInAccountStore.fieldErrors}
                isSubmitDisabled={signInAccountStore.isUpdating || mintingNftStatus === 'pending'}
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
