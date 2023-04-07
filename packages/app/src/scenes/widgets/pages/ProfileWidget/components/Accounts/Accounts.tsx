import {FC, useState} from 'react';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';

import {UserModelInterface} from 'core/models';
import {availableWallets, WalletConfigInterface} from 'wallets';
import {WalletLogin} from 'scenes/widgets/pages/LoginWidget/components';

interface PropsInterface {
  user: UserModelInterface;
}

const Accounts: FC<PropsInterface> = ({user}) => {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletConfigInterface | null>(null);

  const handleConnectWallet = () => {
    setConnectDialogOpen(true);
    setError(null);
  };

  const handleAccountConnected = () => {
    setConnectDialogOpen(false);
    setSelectedWallet(null);
  };

  return (
    <div>
      {!connectDialogOpen ? (
        <>
          <Text text="Accounts:" size="s" align="left" />
          {user.wallets?.map((wallet) => (
            <Text key={wallet} text={wallet} size="s" align="left" breakLongWord />
          ))}
          <Button icon="add" size="medium" label="Connect wallet" onClick={handleConnectWallet} />
        </>
      ) : (
        <div>
          {!selectedWallet && (
            <div>
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
            </div>
          )}
          {selectedWallet && (
            <WalletLogin
              key={selectedWallet.name}
              walletConf={selectedWallet}
              attachSecondaryAccount
              onConnected={handleAccountConnected}
              onError={(err) => {
                setError(err.toString());
              }}
            />
          )}
          {!!error && <Text text={error} size="s" align="left" />}
          <Button size="medium" label="Cancel" onClick={() => setConnectDialogOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default observer(Accounts);
