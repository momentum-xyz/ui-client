import React, {FC, useCallback} from 'react';
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
  const {authStore, nftStore, signInAccountStore, sessionStore} = useStore();
  const {balance, requestInitialFunds, requestingFundsStatus, mintingNftStatus, mintNft} = nftStore;

  const history = useHistory();

  // const fetchTokenByWallet = useCallback(async () => {
  //   const address = nftStore.getAddressByWallet(authStore.wallet);
  //   if (address) {
  //     await authStore.fetchTokenByWallet(address);
  //   }
  // }, [authStore, nftStore]);

  const onConnectWallet = useCallback(() => {
    console.log('onConnectWallet', balance, balance.free);
    if (balance.free === 0) {
      requestInitialFunds(authStore.wallet);
    }
  }, [authStore.wallet, balance, requestInitialFunds]);

  const handleSubmit = useCallback(
    async (form: SignUpFormInterface) => {
      try {
        await mintNft(authStore.wallet, form.name || '');

        const address = nftStore.getAddressByWallet(authStore.wallet);
        if (address) {
          await authStore.fetchTokenByWallet(address);
        }

        const isDone = await signInAccountStore.updateProfile(form);
        if (isDone) {
          await sessionStore.loadUserProfile();
          // .catch((err) => {
          //   console.log('error loading profile', err, 'TEMP ignore');
          // });
          history.push(ROUTES.birth);
        }
      } catch (err) {
        console.log('error minting nft', err);
      }
    },
    [authStore, history, mintNft, nftStore, sessionStore, signInAccountStore]
    // [history, sessionStore, signInAccountStore]
  );

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          {!authStore.token && (
            <ChoiceYourWallet
              walletOptions={nftStore.accountOptions}
              wallet={authStore.wallet}
              isConnectDisabled={authStore.isPending || requestingFundsStatus === 'pending'}
              onSelectAddress={authStore.selectWallet}
              onConnect={onConnectWallet}
            />
          )}
          {requestingFundsStatus === 'pending' && <Text text="Loading MTM..." size="m" />}
          {requestingFundsStatus === 'error' && <Text text="Error loading MTM" size="m" />}

          {(requestingFundsStatus === 'success' || balance.free > 0) && (
            <>
              {requestingFundsStatus === 'success' && <CongratulationsBox />}
              <SinusBox />
              <CreateOdysseyForm
                fieldErrors={signInAccountStore.fieldErrors}
                isSubmitDisabled={signInAccountStore.isUpdating}
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
