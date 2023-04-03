import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from '@momentum-xyz/ui-kit-storybook';

import {WalletConfigInterface} from 'wallets';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';

import * as styled from './WalletLogin.styled';

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
  const {sessionStore, nftStore} = useStore();
  const {name, useWallet} = walletConf;
  const {nftItems} = nftStore;

  const {signChallenge, content, account, accountHex} = useWallet({
    appVariables: appVariables as any,
    walletsToDisplay: 'withNfts',
    existingNftAddresses: nftItems.map((d) => d.owner)
  });
  console.log('WalletLogin', {name, signChallenge, content, account, accountHex});

  const innerView = content || (
    <div>
      {!!account && (
        <div>
          <styled.TitleText className="wallet">{account}</styled.TitleText>
        </div>
      )}
    </div>
  );

  const accountCanLogin = accountHex && nftStore.nftItems.find((d) => d.owner === account);

  return (
    <styled.Container>
      <styled.TitleText>Connect with {name}</styled.TitleText>
      <styled.WalletInnerViewContainer>{innerView}</styled.WalletInnerViewContainer>
      {accountHex && !accountCanLogin && (
        <span style={{color: 'white'}}>
          A registration with this wallet does not exist, go to to the profile creation flow
        </span>
      )}
      <Button
        label="Connect your wallet"
        icon="wallet"
        disabled={!accountHex || !accountCanLogin}
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
    </styled.Container>
  );
};

export default observer(WalletLogin);
