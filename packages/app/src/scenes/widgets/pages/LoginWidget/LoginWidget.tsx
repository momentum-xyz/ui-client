import {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel, Hexagon, FrameText} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {availableWallets, WalletConfigInterface} from 'wallets';

import {WalletLogin} from './components';
import * as styled from './LoginWidget.styled';

const LoginWidget: FC = () => {
  const {sessionStore, widgetManagerStore} = useStore();
  const {t} = useI18n();

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

  return (
    <styled.Container>
      <Panel
        title={t('login.signInTitle')}
        variant="primary"
        hexagon={<Hexagon type="secondary-borderless" iconName="enter" />}
      >
        <FrameText
          title={t('login.signInWithYourWalletTitle')}
          line1={t('login.signInWithYourWalletDescription')}
        />
        <styled.SignInMethodsContainer>
          <span className="title">{t('login.connectYourWallet')}</span>
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
          />
        )}
      </Panel>
    </styled.Container>
  );
};

export default observer(LoginWidget);
