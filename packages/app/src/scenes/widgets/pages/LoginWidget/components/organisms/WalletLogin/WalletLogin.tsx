/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit-storybook';

import {WalletConfigInterface} from 'wallets';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';

import * as styled from './WalletLogin.styled';

interface PropsInterface {
  walletConf: WalletConfigInterface;
  onConnected: () => void;
  onError?: (error: any) => void;
}

const WalletLogin: FC<PropsInterface> = ({walletConf, onConnected, onError}) => {
  const {name, useWallet} = walletConf;
  const {sessionStore} = useStore();

  const {signChallenge, content, account, accountHex} = useWallet({
    appVariables: appVariables as any
  });
  console.log('WalletLogin', {name, signChallenge, content, account, accountHex});

  const onConnectWallet = (): void => {
    if (!accountHex) {
      return void console.log('Account not selected');
    }

    sessionStore
      .fetchTokenByWallet2(accountHex, signChallenge)
      .then(onConnected)
      .catch((err) => {
        console.log('Error connecting wallet', err);
        onError?.(err);
      });
  };

  const innerView = content || (
    <div>
      {!!account && (
        <div>
          <styled.TitleText className="wallet">{account}</styled.TitleText>
        </div>
      )}
    </div>
  );

  return (
    <styled.Container>
      <styled.TitleText>Connect with {name}</styled.TitleText>
      <styled.WalletInnerViewContainer>{innerView}</styled.WalletInnerViewContainer>
      <Button
        label="Connect your wallet"
        icon="wallet"
        disabled={!accountHex}
        wide
        onClick={() => onConnectWallet()}
      />
    </styled.Container>
  );
};

export default observer(WalletLogin);
