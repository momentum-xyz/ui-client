import {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel, Hexagon, FrameText} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {PreviewOdysseyWidget} from 'scenes/widgets_OLD_2/pages';
import {availableWallets, WalletConfigInterface} from 'wallets';

import {WalletLogin} from './components';
import * as styled from './SignInPage.styled';

const TEXT_LINE = 'Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.';

const SignInPage: FC = () => {
  const {sessionStore, nftStore, widgetsStore} = useStore();

  // eslint-disable-next-line no-debugger
  debugger;
  console.log(nftStore.nftItemsWithAccounts);

  const {previewOdysseyStore} = widgetsStore;

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

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
          <styled.PanelContainer>
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
          </styled.PanelContainer>
        </styled.Boxes>
      </styled.Wrapper>

      {previewOdysseyStore.dialog.isOpen && <PreviewOdysseyWidget />}
    </styled.Container>
  );
};

export default observer(SignInPage);
