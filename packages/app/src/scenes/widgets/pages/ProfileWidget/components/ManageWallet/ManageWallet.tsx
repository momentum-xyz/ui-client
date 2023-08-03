import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {ButtonEllipse, Frame, WalletHash} from '@momentum-xyz/ui-kit';

import {WalletInterface} from 'api';
import {WalletLogin, TrustPoints, WalletSelector} from 'ui-kit';
import {WalletConfigInterface} from 'wallets';

import * as styled from './ManageWallet.styled';

interface PropsInterface {
  defaultWalletId: string;
  wallets: WalletInterface[];
  onChangeDefaultWallet: (walletId: string) => void;
  onRemoveWallet: (address: string) => void;
  onReloadWallets: () => void;
}

const ManageWallet: FC<PropsInterface> = ({
  wallets,
  defaultWalletId,
  onChangeDefaultWallet,
  onRemoveWallet,
  onReloadWallets
}) => {
  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  const {t} = useI18n();

  const handleAccountConnected = () => {
    setSelectedWallet(null);
    onReloadWallets();
  };

  return (
    <styled.Container data-testid="ManageWallet-test">
      <Frame>
        <styled.Title>{t('titles.myWalletAccounts')}</styled.Title>

        <styled.WalletContainer>
          {wallets.map(({wallet_id, wallet_icon}) => {
            const isDefault = wallet_id === defaultWalletId;

            return (
              <styled.Wallet key={wallet_id}>
                <WalletHash hash={wallet_id} icon={wallet_icon} />
                <styled.WalletActions>
                  <ButtonEllipse
                    isLabel={isDefault}
                    variant="secondary"
                    icon={isDefault ? 'starOn' : 'star'}
                    label={isDefault ? t('actions.default') : t('actions.setAsDefault')}
                    onClick={() => onChangeDefaultWallet(wallet_id)}
                  />
                  <ButtonEllipse
                    icon="bin"
                    variant="secondary"
                    disabled={isDefault}
                    label={t('actions.remove')}
                    onClick={() => onRemoveWallet(wallet_id)}
                  />
                </styled.WalletActions>
              </styled.Wallet>
            );
          })}
        </styled.WalletContainer>

        <styled.ConnectContainer>
          <styled.Title>{t('titles.connectAnotherWallet')}</styled.Title>
          <WalletSelector onSelect={setSelectedWallet} />
          {!selectedWallet && <TrustPoints />}
        </styled.ConnectContainer>

        {selectedWallet && (
          <div>
            <styled.ConnectWithWalletRow>
              <img src={selectedWallet.logo} alt={`${selectedWallet.name}-icon`} />
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
      </Frame>
    </styled.Container>
  );
};

export default observer(ManageWallet);
