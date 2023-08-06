import {FC, useEffect} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {Warning} from '@momentum-xyz/ui-kit';

import {appVariables} from 'api/constants';
import {WalletConfigInterface} from 'wallets';

import * as styled from './WalletSelectHelper.styled';

interface WalletSelectHelperPropsInterface {
  walletConf: WalletConfigInterface;
  requiredAccountAddress: string;
  requiredChainId: number;
  wrongChainErrorMessage?: string;
  onActivationDone: (isSuccess: boolean) => void;
  onSelectedAccountChanged: (account: string) => void;
  onLibraryLoaded: (library: any) => void;
  onNetworkStatusChanged: (isWrongNetwork: boolean) => void;
}

const WalletSelectHelper: FC<WalletSelectHelperPropsInterface> = ({
  walletConf,
  requiredAccountAddress,
  requiredChainId,
  wrongChainErrorMessage,
  onActivationDone,
  onSelectedAccountChanged,
  onLibraryLoaded,
  onNetworkStatusChanged
}) => {
  const {useWallet} = walletConf;
  const walletProps = {appVariables: appVariables as any, onActivationDone};

  const {t} = useI18n();
  const {web3Library, chainId, account, activate, isActive} = useWallet(walletProps);

  console.log('WalletSelectHelper', {
    web3Library,
    chainId,
    account,
    activate,
    isActive,
    requiredAccountAddress
  });

  useEffect(() => {
    if (account) {
      onSelectedAccountChanged(account);
    }
  }, [account, onSelectedAccountChanged]);

  useEffect(() => {
    if (web3Library) {
      onLibraryLoaded(web3Library);
    }
  }, [web3Library, onLibraryLoaded]);

  const isWrongNetwork = !!chainId && chainId !== requiredChainId;

  useEffect(() => {
    onNetworkStatusChanged(isWrongNetwork);
    // TODO switch automatically
  }, [isWrongNetwork, onNetworkStatusChanged]);

  if (isActive && !web3Library) {
    return (
      <styled.Message data-testid="WalletSelectHelper-test">
        <Warning message={t('errors.wrongAccount')} wide />
      </styled.Message>
    );
  }

  if (isWrongNetwork) {
    console.log('WalletSelectHelper current chainId', {
      chainId,
      requiredChainId,
      web3Library
    });
    return (
      <styled.Message data-testid="WalletSelectHelper-test">
        <Warning message={wrongChainErrorMessage || t('errors.switchToArbitrum')} wide />
      </styled.Message>
    );
  }

  if (account && account !== requiredAccountAddress) {
    return (
      <styled.Message data-testid="WalletSelectHelper-test">
        <Warning message={t('errors.switchAccount')} wide />
      </styled.Message>
    );
  }

  return <></>;
};

export default WalletSelectHelper;
