import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';
import {GuestLoginFormInterface} from 'core/interfaces';

import {CreateOdyssey, TravellerBox, Login, LoginGuest} from './components';
import * as styled from './SignInPage.styled';

const SignInPage: FC = () => {
  const {authStore, nftStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    authStore.clear();
    localStorage.clear();
  }, [authStore]);

  const handleLogin = useCallback(async () => {
    const address = nftStore.getAddressByWallet(authStore.wallet);
    if (address) {
      const isDone = await authStore.fetchTokenByWallet(address);
      if (isDone) {
        history.push(ROUTES.explore);
      }
    }
  }, [authStore, history, nftStore]);

  const handleGuestLogin = useCallback(
    async (form: GuestLoginFormInterface) => {
      const isDone = await authStore.fetchGuestToken(form);
      if (isDone) {
        history.push(ROUTES.explore);
      }
    },
    [authStore, history]
  );

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <TravellerBox />
          <SinusBox />
          <CreateOdyssey onCreate={() => history.push(ROUTES.signInAccount)} />
        </styled.Boxes>

        <styled.Boxes>
          {/* Login as a normal user */}
          <Login
            walletOptions={nftStore.accountOptions}
            wallet={authStore.wallet}
            isPending={authStore.isPending}
            onSelectAddress={authStore.selectWallet}
            onLogin={handleLogin}
          />

          <SinusBox />
          {/* Login as guest */}
          <LoginGuest isPending={authStore.isGuestPending} onLogin={handleGuestLogin} />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInPage);
