import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {FrameText} from '@momentum-xyz/ui-kit-storybook';
import {useI18n} from '@momentum-xyz/core';

import {availableWallets, WalletConfigInterface} from 'wallets';

import {WalletLogin} from '../WalletLogin';

import * as styled from './SignIn.styled';

interface PropsInterface {
  onConnected: () => void;
}

const SignIn: FC<PropsInterface> = ({onConnected}) => {
  const {t} = useI18n();

  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  return (
    <styled.Container>
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
          onConnected={onConnected}
        />
      )}
    </styled.Container>
  );
};

export default observer(SignIn);
