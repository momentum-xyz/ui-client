import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {SinusBox} from 'ui-kit';

import {CreateOdyssey, TravellerBox, Login} from './components';
import * as styled from './SignInPage.styled';

const SignInPage: FC = () => {
  const {sessionStore, signInStore, nftStore} = useStore();

  const history = useHistory();

  // TODO: CHECK
  const targetRoute = window.history.state?.state?.from || ROUTES.explore;

  const handleLogin = useCallback(async () => {
    const address = nftStore.getAddressByWallet(signInStore.wallet);
    if (address) {
      await sessionStore.fetchTokenByWallet(address);
      await sessionStore.loadUserProfile();
    }
  }, [nftStore, sessionStore, signInStore.wallet]);

  /*
  const handleGuestLogin = useCallback(
    async (form: GuestLoginFormInterface) => {
      const isDone = await sessionStore.fetchGuestToken(form);
      if (isDone) {
        history.push(targetRoute);
      }
    },
    [sessionStore, history, targetRoute]
  );
  */

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
              isPending={sessionStore.isTokenPending}
              onSelectAddress={signInStore.selectWallet}
              onLogin={handleLogin}
            />
          )}

          {/*<SinusBox />
          <LoginGuest
            isPending={sessionStore.isGuestTokenPending}
            hasNonGuestAccount={!!nftStore.accountsWithNftsOptions.length}
            onLogin={handleGuestLogin}
          />*/}
        </styled.Boxes>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(SignInPage);
