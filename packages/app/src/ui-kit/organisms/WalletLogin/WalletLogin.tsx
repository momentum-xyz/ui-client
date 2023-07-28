import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, WalletHash} from '@momentum-xyz/ui-kit';

import {WalletConfigInterface} from 'wallets';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';

import * as styled from './WalletLogin.styled';

interface PropsInterface {
  walletConf: WalletConfigInterface;
  attachSecondaryAccount?: boolean;
  onConnected?: () => void;
  onError?: (error: any) => void;
}

const WalletLogin: FC<PropsInterface> = ({
  walletConf,
  onConnected,
  onError,
  attachSecondaryAccount = false
}) => {
  const {name, useWallet, browserExtensionUrl} = walletConf;
  const {sessionStore, nftStore} = useStore();

  const {t} = useI18n();

  const {signChallenge, content, account, isInstalled, accountHex} = useWallet({
    appVariables: appVariables as any,
    onActivationDone: (success) => {
      console.log('WalletLogin onActivationDone, success:', success);
    }
  });
  console.log('WalletLogin', {name, signChallenge, content, account, accountHex});

  const onConnectWallet = (): void => {
    if (!accountHex) {
      return void console.log('Account not selected');
    }

    (attachSecondaryAccount
      ? sessionStore.attachAnotherAccount(accountHex, signChallenge)
      : sessionStore.fetchTokenByWallet(accountHex, signChallenge).then((token) => {
          sessionStore.saveTokenAndRefreshUser(token);
        })
    )
      .then(() => {
        nftStore.setWalletIdByAddress(accountHex, walletConf.id);
        onConnected?.();
      })
      .catch((err) => {
        console.log('Error connecting wallet', err);
        onError?.(err);
      });
  };

  return (
    <styled.Container data-testid="WalletLogin-test">
      {isInstalled ? (
        <>
          <styled.WalletInnerViewContainer>
            {!!content && <>{content}</>}
            {!!account && !content && <WalletHash hash={account} />}
          </styled.WalletInnerViewContainer>

          <Button
            label={t('login.connectYourWallet')}
            icon="wallet"
            disabled={!accountHex}
            wide
            onClick={() => onConnectWallet()}
          />
        </>
      ) : (
        <Button
          label={t('login.installBrowserExtension')}
          icon="logout" // TODO: Add missing 'install' icon to storybook and use it here
          wide
          onClick={() => window.open(browserExtensionUrl, '_blank')}
        />
      )}
    </styled.Container>
  );
};

export default observer(WalletLogin);
