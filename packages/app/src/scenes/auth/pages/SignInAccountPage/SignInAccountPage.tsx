import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {SignUpFormInterface} from 'core/interfaces';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {CreateOdysseyForm, ChoiceYourWallet, CongratulationsBox} from './components';
import * as styled from './SignInAccountPage.styled';

const SignInAccountPage: FC = () => {
  const {authStore, nftStore, signInAccountStore, sessionStore} = useStore();

  const history = useHistory();

  const fetchTokenByWallet = useCallback(async () => {
    const address = nftStore.getAddressByWallet(authStore.wallet);
    if (address) {
      await authStore.fetchTokenByWallet(address);
    }
  }, [authStore, nftStore]);

  const handleSubmit = useCallback(
    async (form: SignUpFormInterface) => {
      const isDone = await signInAccountStore.updateProfile(form);
      if (isDone) {
        await sessionStore.loadUserProfile();
        history.push(ROUTES.birth);
      }
    },
    [history, sessionStore, signInAccountStore]
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
              isConnectDisabled={authStore.isPending}
              onSelectAddress={authStore.selectWallet}
              onConnect={fetchTokenByWallet}
            />
          )}

          {!!authStore.token && (
            <>
              <CongratulationsBox />
              <SinusBox />
              <CreateOdysseyForm
                fieldErrors={signInAccountStore.fieldErrors}
                isSubmitDisabled={signInAccountStore.isUpdating}
                onSubmit={handleSubmit}
              />
            </>
          )}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInAccountPage);
