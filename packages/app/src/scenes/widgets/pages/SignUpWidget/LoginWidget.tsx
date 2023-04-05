/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel, Hexagon, FrameText, StepInterface, FrameSteps} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
import {availableWallets, WalletConfigInterface} from 'wallets';

import {WalletLogin} from './components';
import * as styled from './LoginWidget.styled';

const LoginWidget: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  const handleAccountConnected = useCallback(async () => {
    console.log('handleAccountConnected');
    try {
      widgetManagerStore.closeAll();
      await sessionStore.loadUserProfile();
    } catch (e) {
      console.log('Error loading profile', e);
    }
  }, [sessionStore, widgetManagerStore]);

  const activeStep = 0; // accountSelectedAndFundsAcquired ? 1 : 0;
  const stepList: StepInterface[] = [
    {label: '1', variant: activeStep === 0 ? 'active' : 'prev'},
    {label: '2', variant: activeStep === 0 ? 'next' : 'active'}
  ];
  const innerItems = [];

  return (
    <styled.Container>
      <Panel
        title="Become a member"
        variant="primary"
        hexagon={<Hexagon type="secondary-borderless" iconName="astronaut" />}
      >
        {/* <FrameSteps stepList={stepList}>{innerItem}</FrameSteps> */}
        {/* <FrameText
          title="Sign in with your wallet"
          line1="Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula."
        />
        <styled.SignInMethodsContainer>
          <span className="title">Connect your wallet</span>
          <div className="methods">
            {availableWallets.map((wallet) => {
              const {name, icon} = wallet;
              return (
                <styled.SignInMethodContainer key={name} onClick={() => setSelectedWallet(wallet)}>
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
            // onCancel={() => setSelectedWallet(null)}
          />
        )} */}
      </Panel>
    </styled.Container>
    // <styled.Container>
    //   <CreateOdyssey onCreate={() => {}} />

    //   {!selectedWallet && (
    //     <Box>
    //       <Text text="Connect your wallet" size="m" />
    //       {availableWallets.map((wallet) => {
    //         const {name} = wallet;
    //         return (
    //           <div style={{marginTop: '15px'}} key={name}>
    //             <Button wide label={name} key={name} onClick={() => setSelectedWallet(wallet)} />
    //           </div>
    //         );
    //       })}
    //     </Box>
    //   )}
    //   {selectedWallet && (
    //     <WalletLogin
    //       key={selectedWallet.name}
    //       walletConf={selectedWallet}
    //       onConnected={handleAccountConnected}
    //       onCancel={() => setSelectedWallet(null)}
    //     />
    //   )}
    // </styled.Container>
  );
};

export default observer(LoginWidget);
