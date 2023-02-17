import React, {FC, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';

import {SinusBox} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {PreviewOdysseyWidget} from 'scenes/widgets/pages';

import {CreateOdyssey, TravellerBox, Login} from './components';
import * as styled from './SignInPage.styled';

const SignInPage: FC = () => {
  const {sessionStore, signInStore, nftStore, widgetsStore} = useStore();
  const {previewOdysseyStore} = widgetsStore;

  const navigate = useNavigate();

  const handleSignIn = useCallback(async () => {
    const address = nftStore.getAddressByWallet(signInStore.wallet);
    if (address) {
      await sessionStore.fetchTokenByWallet(address);
      await sessionStore.loadUserProfile();
    }
  }, [nftStore, sessionStore, signInStore.wallet]);

  const handleSignUp = useCallback(() => {
    navigate(ROUTES.signInAccount);
  }, [navigate]);

  return (
    <styled.Container>
      <styled.Wrapper>
        <styled.Boxes>
          <SinusBox />
          <TravellerBox />
          <SinusBox />
          <CreateOdyssey onCreate={handleSignUp} />
        </styled.Boxes>

        <styled.Boxes>
          {/* Login as a normal user */}
          {!!nftStore.accountsWithNftsOptions.length && (
            <Login
              walletOptions={nftStore.accountsWithNftsOptions}
              wallet={signInStore.wallet}
              isPending={sessionStore.isTokenPending}
              onSelectAddress={signInStore.selectWallet}
              onLogin={handleSignIn}
            />
          )}
        </styled.Boxes>
      </styled.Wrapper>

      {previewOdysseyStore.dialog.isOpen && <PreviewOdysseyWidget />}
    </styled.Container>
  );
};

export default observer(SignInPage);
