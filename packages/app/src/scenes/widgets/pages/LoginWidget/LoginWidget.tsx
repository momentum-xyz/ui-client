import {FC, useCallback, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {Box} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {availableWallets, WalletConfigInterface} from 'wallets';

import {CreateOdyssey, WalletLogin} from './components';
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

  return (
    <styled.Container>
      <CreateOdyssey onCreate={() => {}} />

      {!selectedWallet && (
        <Box>
          <Text text="Connect your wallet" size="m" />
          {availableWallets.map((wallet) => {
            const {name} = wallet;
            return (
              <div style={{marginTop: '15px'}} key={name}>
                <Button wide label={name} key={name} onClick={() => setSelectedWallet(wallet)} />
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
    </styled.Container>
  );
};

export default observer(LoginWidget);
