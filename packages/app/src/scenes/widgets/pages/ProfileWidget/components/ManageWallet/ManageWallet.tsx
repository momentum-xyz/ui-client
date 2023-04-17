import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import cn from 'classnames';
import {useI18n} from '@momentum-xyz/core';
import {ButtonEllipse, Frame, WalletHash} from '@momentum-xyz/ui-kit-storybook';

import {WalletLogin, TrustPoints} from 'ui-kit';
import {UserModelInterface} from 'core/models';
import {availableWallets, WalletConfigInterface} from 'wallets';

import * as styled from './ManageWallet.styled';

interface PropsInterface {
  user: UserModelInterface;
}

const ManageWallet: FC<PropsInterface> = ({user}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  const {t} = useI18n();

  const handleAccountConnected = () => {
    setSelectedWallet(null);
  };

  return (
    <styled.Container data-testid="ManageWallet-test">
      <Frame>
        <styled.Title>{t('titles.myWalletAccounts')}</styled.Title>
        <styled.GeneralScrollable>
          <styled.WalletContainer>
            {user.wallets?.map((wallet, index) => (
              <styled.Wallet key={wallet}>
                <WalletHash hash={wallet} icon="metamask" />
                {index === 0 ? (
                  <styled.WalletActions>
                    <ButtonEllipse isLabel icon="starOn" label={t('actions.default')} />
                    <ButtonEllipse icon="bin" label={t('actions.remove')} disabled />
                  </styled.WalletActions>
                ) : (
                  <styled.WalletActions>
                    <ButtonEllipse icon="star" label={t('actions.setAsDefault')} />
                    <ButtonEllipse icon="bin" label={t('actions.remove')} />
                  </styled.WalletActions>
                )}
              </styled.Wallet>
            ))}
          </styled.WalletContainer>

          <styled.ConnectContainer>
            <styled.Title>{t('title.connectAnotherWallet')}</styled.Title>
            <styled.Methods>
              {availableWallets
                .filter((m) => m.name !== 'Polkadot')
                .map((wallet) => (
                  <styled.MethodItem
                    key={wallet.name}
                    className={cn(selectedWallet?.name === wallet.name && 'active')}
                    onClick={() => {
                      setSelectedWallet(wallet);
                    }}
                  >
                    <img src={wallet.icon} alt={`${wallet.name}-icon`} />
                    <span>{wallet.name}</span>
                  </styled.MethodItem>
                ))}
            </styled.Methods>

            {!selectedWallet && <TrustPoints />}
          </styled.ConnectContainer>

          {selectedWallet && (
            <div>
              <styled.ConnectWithWalletRow>
                <img src={selectedWallet.icon} alt={`${selectedWallet.name}-icon`} />
                <span>{t('login.connectWith', {wallet: selectedWallet.name})}</span>
              </styled.ConnectWithWalletRow>

              {selectedWallet && (
                <WalletLogin
                  key={selectedWallet.name}
                  walletConf={selectedWallet}
                  attachSecondaryAccount
                  onConnected={handleAccountConnected}
                  onError={(err) => {
                    console.log(err.toString());
                  }}
                />
              )}
            </div>
          )}
        </styled.GeneralScrollable>
      </Frame>
    </styled.Container>
  );
};

export default observer(ManageWallet);
