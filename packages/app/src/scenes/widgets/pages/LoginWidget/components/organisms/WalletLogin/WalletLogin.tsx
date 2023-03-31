import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, SvgButton, Text} from '@momentum-xyz/ui-kit';

import {WalletConfigInterface} from 'wallets';
import {useStore} from 'shared/hooks';
import {Box} from 'ui-kit';
import {appVariables} from 'api/constants';

interface PropsInterface {
  walletConf: WalletConfigInterface;
  onCancel: () => void;
  onConnected: () => void;
  onError?: (error: any) => void;
  attachSecondaryAccount?: boolean;
}

const WalletLogin: FC<PropsInterface> = ({
  walletConf,
  attachSecondaryAccount = false,
  onConnected,
  onError,
  onCancel
}) => {
  const {sessionStore} = useStore();
  const {name, useWallet} = walletConf;

  const {signChallenge, content, account, accountHex} = useWallet({
    appVariables: appVariables as any
  });
  console.log('WalletLogin', {name, signChallenge, content, account, accountHex});

  const innerView = content || (
    <div>
      {!!account && (
        <div
          style={{
            margin: '1em'
          }}
        >
          <Text text={account} size="m" />
        </div>
      )}
    </div>
  );

  return (
    <Box>
      <SvgButton iconName="close" size="normal" onClick={onCancel} />
      <div
        style={{
          margin: '1em'
        }}
      >
        <Text text={name} size="m" />
      </div>

      {innerView}

      <Button
        label="Connect"
        disabled={!accountHex}
        wide
        onClick={() => {
          if (!accountHex) {
            console.log('Account not selected');
            return;
          }

          (attachSecondaryAccount
            ? sessionStore.attachAnotherAccount(accountHex, signChallenge)
            : sessionStore.fetchTokenByWallet2(accountHex, signChallenge)
          )
            .then(onConnected)
            .catch((err) => {
              console.log('Error connecting wallet', err);
              onError?.(err);
            });
        }}
      />
    </Box>
  );
};

export default observer(WalletLogin);
