import React, {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
// import {useNavigate} from 'react-router-dom';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {Panel, Hexagon, FrameText} from '@momentum-xyz/ui-kit-storybook';

import {Box} from 'ui-kit';
// import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {PreviewOdysseyWidget} from 'scenes/widgets_OLD_2/pages';
import {availableWallets, WalletConfigInterface} from 'wallets';

import {WalletLogin} from './components';
import * as styled from './SignInPage.styled';

const TEXT_LINE = 'Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.';

const SignInPage: FC = () => {
  const {
    sessionStore,
    // signInStore, nftStore,
    widgetsStore
  } = useStore();
  const {previewOdysseyStore} = widgetsStore;

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  // const navigate = useNavigate();

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

  // const handleSignUp = useCallback(() => {
  //   navigate(ROUTES.signInAccount);
  // }, [navigate]);

  // const hexagon = <Hexagon type="secondary-borderless" iconName="planet" />;
  return (
    <styled.Container>
      <styled.Wrapper>
        {/* <styled.Boxes>
          <SinusBox />
          <TravellerBox />
          <SinusBox />
          <CreateOdyssey onCreate={handleSignUp} />
        </styled.Boxes> */}

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
          <styled.WidgetContainer>
            <Panel
              title="Sign In"
              variant="primary"
              hexagon={<Hexagon type="secondary-borderless" iconName="planet" />}
            >
              <FrameText title="Sign in with your wallet" line1={TEXT_LINE} />
              <styled.SignInMethodsContainer>
                <span className="title">Connect your wallet</span>
                <div className="methods">
                  {availableWallets.map((wallet) => {
                    const {name, icon} = wallet;
                    return (
                      <styled.SignInMethodContainer
                        key={name}
                        onClick={() => setSelectedWallet(wallet)}
                      >
                        <img src={icon} alt={`${name}-icon`} />
                        <span>{name}</span>
                      </styled.SignInMethodContainer>
                    );
                  })}
                </div>
              </styled.SignInMethodsContainer>
              {selectedWallet && (
                <WalletLogin
                  key={selectedWallet.name}
                  walletConf={selectedWallet}
                  onConnected={handleAccountConnected}
                  onCancel={() => setSelectedWallet(null)}
                />
              )}
            </Panel>
          </styled.WidgetContainer>
          {!selectedWallet && (
            <>
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
            </>
          )}
          {/* {selectedWallet && (
            <WalletLogin
              key={selectedWallet.name}
              walletConf={selectedWallet}
              onConnected={handleAccountConnected}
              onCancel={() => setSelectedWallet(null)}
            />
          )} */}
        </styled.Boxes>
      </styled.Wrapper>

      {previewOdysseyStore.dialog.isOpen && <PreviewOdysseyWidget />}
    </styled.Container>
  );
};

export default observer(SignInPage);
