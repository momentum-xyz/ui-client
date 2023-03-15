import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useNavigate} from 'react-router-dom';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {WalletConfigInterface} from 'wallets/wallets.types';

import {SinusBox, Box} from 'ui-kit';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {PreviewOdysseyWidget} from 'scenes/widgets/pages';
import {availableWallets} from 'wallets';

import {
  CreateOdyssey,
  TravellerBox,
  // Login,
  WalletLogin
} from './components';
import * as styled from './SignInPage.styled';

const SignInPage: FC = () => {
  const {
    sessionStore,
    // signInStore, nftStore,
    widgetsStore
  } = useStore();
  const {previewOdysseyStore} = widgetsStore;

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  const navigate = useNavigate();

  // const handleSignIn = useCallback(async () => {
  //   const address = nftStore.getAddressByWallet(signInStore.wallet);
  //   if (address) {
  //     try {
  //       const success = await sessionStore.fetchTokenByWallet(address);
  //       if (success) {
  //         await sessionStore.loadUserProfile();
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }, [nftStore, sessionStore, signInStore.wallet]);

  const handleAccountConnected = useCallback(async () => {
    console.log('handleAccountConnected');
    try {
      await sessionStore.loadUserProfile();
    } catch (e) {
      console.log('Error loading profile', e);
    }
  }, [sessionStore]);

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
          {/* {!!nftStore.accountsWithNftsOptions.length && (
            <Login
              // walletOptions={nftStore.accountsWithNftsOptions}
              walletOptions={nftStore.accountOptions}
              wallet={signInStore.wallet}
              isPending={sessionStore.isTokenPending}
              onSelectAddress={signInStore.selectWallet}
              onLogin={handleSignIn}
            />
          )} */}
          {!selectedWallet && (
            <Box>
              <Text text="Connect your wallet" size="m" />
              {availableWallets.map((wallet) => {
                const {name} = wallet;
                return (
                  <div style={{marginTop: '15px'}} key={name}>
                    <Button
                      wide
                      label={name}
                      key={name}
                      onClick={() => setSelectedWallet(wallet)}
                    />
                  </div>
                );
              })}
            </Box>
          )}
          {selectedWallet && (
            <WalletLogin
              key={selectedWallet.name}
              walletConf={selectedWallet}
              onConnected={handleAccountConnected}
              onCancel={() => setSelectedWallet(null)}
            />
          )}
        </styled.Boxes>
      </styled.Wrapper>

      {previewOdysseyStore.dialog.isOpen && <PreviewOdysseyWidget />}
    </styled.Container>
  );
};

export default observer(SignInPage);
