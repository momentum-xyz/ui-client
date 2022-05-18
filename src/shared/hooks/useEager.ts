import {Buffer} from 'buffer';
import {useWeb3React} from '@web3-react/core';
import {useEffect, useState} from 'react';
import {AbstractConnector} from '@web3-react/abstract-connector';
import {decodeAddress} from '@polkadot/util-crypto';
import {stringToHex, u8aToHex} from '@polkadot/util';
import {isWeb3Injected, web3Accounts, web3Enable, web3FromSource} from '@polkadot/extension-dapp';

import {LoginTypeEnum} from 'core/enums';
import {Web3ConnectorInterface} from 'core/interfaces';
import {PolkadotExtensionException, SessionException} from 'core/exceptions';

const WEB3_ENABLE_ORIGIN_NAME = 'momentum-world';
const POLKADOT_CANCELED_ERROR = 'Eager: Polkadot auth canceled';
const SESSION_CANCELED_ERROR = 'OIDC: Session auth canceled';
const WEB3_ACTIVATE_ERROR = 'Eager: Activate state callback error';
const WEB3_SIGN_ERROR = 'Eager: Error occurred while signing the message';

// @ts-ignore: Fix internal error of wallet connect
(window as any).global = window;
// @ts-ignore: Fix internal error of wallet connect
window.Buffer = window.Buffer || Buffer;

export const useEager = (
  login_challenge: string,
  web3Connector: Web3ConnectorInterface,
  polkadotAddress: string | null | undefined,
  getChallengeForSign: (challenge: string, address: string) => Promise<{address_challenge: string}>,
  loginAccept: (address: string, login: string, wallet?: string) => Promise<{redirect: string}>,
  onAccepted: (callback: string) => void,
  onReset: () => void
) => {
  const {library, activate, active, account} = useWeb3React();
  const [walletConnectionState, setWalletConnectionState] = useState({
    connected: false,
    error: undefined
  });

  const {name, connector} = web3Connector;
  const isWeb3Connector = connector instanceof AbstractConnector;
  const isPolkadotConnector = name === LoginTypeEnum.Polkadot;

  const wait = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

  const activePolkadotExtension = async () => {
    await wait(100);

    const extensions = await web3Enable(WEB3_ENABLE_ORIGIN_NAME);
    if (!isWeb3Injected || extensions.length === 0) {
      const err: any = new PolkadotExtensionException();
      setWalletConnectionState({connected: false, error: err});
      return;
    }

    const allAccounts = await web3Accounts();
    const account = allAccounts.find((i) => i.address === polkadotAddress);
    if (account) {
      const injector = await web3FromSource(account.meta.source);
      const signRaw = injector?.signer?.signRaw;
      if (signRaw) {
        const publicKey = decodeAddress(account.address);
        const hexPublicKey = u8aToHex(publicKey);
        const nonce = (await getChallengeForSign(login_challenge, hexPublicKey)).address_challenge;

        const result = await signRaw({
          address: account.address,
          data: stringToHex(nonce),
          type: 'bytes'
        }).catch((error) => {
          console.error(POLKADOT_CANCELED_ERROR, error);
          setWalletConnectionState({connected: false, error: error});
        });

        if (result?.signature) {
          const acceptResult = await loginAccept(result?.signature, login_challenge, name);
          if (!acceptResult?.redirect) {
            console.error(SESSION_CANCELED_ERROR);
            const exception: any = new SessionException();
            setWalletConnectionState({connected: false, error: exception});
            return;
          }

          window.location.href = acceptResult.redirect;
        }
      }
    }
  };

  const activateWeb3Extension = () => {
    if (connector) {
      activate(
        connector,
        (err) => {
          console.error(`${name} ${WEB3_ACTIVATE_ERROR}`, err);
        },
        true
      )
        .then(() => {
          if (!active) {
            onReset();
          }
        })
        .catch((err) => {
          setWalletConnectionState({connected: false, error: err});
          onReset();
        });
    }
  };

  const signMessage = async () => {
    const nonce = (await getChallengeForSign(login_challenge, account!)).address_challenge;
    const signature = await library
      .getSigner(account)
      .signMessage(nonce)
      .catch((error: any) => {
        console.error(WEB3_SIGN_ERROR, error);
        setWalletConnectionState({connected: false, error: error});
      });

    const loginAcceptResponse = await loginAccept(signature as string, login_challenge);
    onAccepted(loginAcceptResponse.redirect);
  };

  useEffect(() => {
    if (isWeb3Connector) {
      activateWeb3Extension();
    } else if (isPolkadotConnector) {
      activePolkadotExtension();
    }
  }, [isWeb3Connector, isPolkadotConnector]);

  useEffect(() => {
    if (isWeb3Connector && active && library) {
      signMessage();
    }
  }, [isWeb3Connector, active, library, signMessage]);

  useEffect(() => {
    if (!walletConnectionState.connected && active && !walletConnectionState.error) {
      setWalletConnectionState({connected: true, error: undefined});
    }
  }, [walletConnectionState, active]);

  return walletConnectionState;
};
