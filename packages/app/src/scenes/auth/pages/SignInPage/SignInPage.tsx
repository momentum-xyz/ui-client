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
  const {authStore, nftStore, sessionStore} = useStore();

  const history = useHistory();

  useEffect(() => {
    localStorage.clear();
  }, [authStore]);

  const handleLogin = useCallback(
    async (isGuest: boolean, form?: GuestLoginFormInterface) => {
      const isDone =
        !!form && isGuest
          ? await authStore.fetchGuestToken(form)
          : await authStore.fetchTokenByWallet();
      if (isDone) {
        const success = await sessionStore.loadUserProfile();
        if (success) {
          history.push(ROUTES.explore);
        }
      }
    },
    [authStore, sessionStore, history]
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
            onLogin={() => handleLogin(false)}
          />

          <SinusBox />
          {/* Login as guest */}
          <LoginGuest
            isPending={authStore.isGuestPending}
            onLogin={(form) => handleLogin(true, form)}
          />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInPage);
