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
  const {sessionStore, signInStore, nftStore} = useStore();

  const history = useHistory();

  const targetRoute = window.history.state?.state?.from || ROUTES.explore;

  useEffect(() => {
    sessionStore.clear();
    // TODO smt less brutal
    localStorage.clear();
  }, [sessionStore]);

  const handleLogin = useCallback(async () => {
    const address = nftStore.getAddressByWallet(signInStore.wallet);
    if (address) {
      const isDone = await sessionStore.fetchTokenByWallet(address);
      if (isDone) {
        history.push(targetRoute);
      }
    }
  }, [sessionStore, history, nftStore, signInStore.wallet, targetRoute]);

  const handleGuestLogin = useCallback(
    async (form: GuestLoginFormInterface) => {
      const isDone = await sessionStore.fetchGuestToken(form);
      if (isDone) {
        history.push(targetRoute);
      }
    },
    [sessionStore, history, targetRoute]
  );

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <TravellerBox />
          <SinusBox />
          <CreateOdyssey onCreate={() => history.push(ROUTES.signInAccount, {from: targetRoute})} />
        </styled.Boxes>

        <styled.Boxes>
          {/* Login as a normal user */}
          {!!nftStore.accountsWithNftsOptions.length && (
            <Login
              walletOptions={nftStore.accountsWithNftsOptions}
              wallet={signInStore.wallet}
              isPending={sessionStore.isPending}
              onSelectAddress={signInStore.selectWallet}
              onLogin={handleLogin}
            />
          )}

          <SinusBox />
          {/* Login as guest */}
          <LoginGuest
            isPending={sessionStore.isGuestPending}
            hasNonGuestAccount={!!nftStore.accountsWithNftsOptions.length}
            onLogin={handleGuestLogin}
          />
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInPage);
