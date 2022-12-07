import React, {FC, useCallback, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';
import {Text} from '@momentum-xyz/ui-kit';

import {ROUTES} from 'core/constants';
import {SignUpFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {CreateOdysseyForm, ChoiceYourWallet, CongratulationsBox} from './components';
import * as styled from './SignInAccountPage.styled';

const SignInAccountPage: FC = () => {
  const {authStore, nftStore, signInAccountStore} = useStore();
  const {
    balance,
    isBalanceLoading,
    requestInitialFunds,
    requestingFundsStatus,
    mintingNftStatus,
    mintNft
  } = nftStore;
  const [walletWithFundsIsConnected, setWalletWithFundsIsConnected] = useState(false);

  const accountSelectedAndFundsAquired =
    walletWithFundsIsConnected || requestingFundsStatus === 'success';

  useEffect(() => {
    authStore.clear();
  }, [authStore]);

  const history = useHistory();
  console.log('SignInAccountPage', {
    balance,
    walletWithFundsIsConnected,
    isBalanceLoading,
    requestingFundsStatus,
    mintingNftStatus
  });

  const onConnectWallet = useCallback(() => {
    console.log('onConnectWallet', balance);
    if (!balance.free) {
      requestInitialFunds(authStore.wallet);
    } else {
      // there are funds already
      setWalletWithFundsIsConnected(true);
    }
  }, [authStore.wallet, balance, requestInitialFunds]);

  const handleSubmit = useCallback(
    async (form: SignUpFormInterface) => {
      try {
        await mintNft(authStore.wallet, form.name || '');

        // NFT should be minted and accessible by now - if it doesn't happen sometimes
        // we can put some wait here
        await nftStore.fetchNfts();

        history.push(ROUTES.birth);
      } catch (err) {
        console.log('error minting nft', err);
      }
    },
    [authStore, history, mintNft, nftStore]
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
          {requestingFundsStatus === 'pending' && <Text text="Loading MTM..." size="m" />}
          {requestingFundsStatus === 'error' && <Text text="Error loading MTM" size="m" />}

          {accountSelectedAndFundsAquired && (
            <>
              {requestingFundsStatus === 'success' && (
                <CongratulationsBox amount={nftStore.formatAmount(balance.free)} />
              )}
              <SinusBox />
              <CreateOdysseyForm
                fieldErrors={signInAccountStore.fieldErrors}
                isSubmitDisabled={signInAccountStore.isUpdating || mintingNftStatus === 'pending'}
                onSubmit={handleSubmit}
              />
            </>
          )}
          {mintingNftStatus === 'pending' && <Text text="Minting NFT..." size="m" />}
          {mintingNftStatus === 'error' && <Text text="Error minting NFT" size="m" />}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInAccountPage);
