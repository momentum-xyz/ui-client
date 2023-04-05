/* eslint-disable @typescript-eslint/no-unused-vars */
import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Input} from '@momentum-xyz/ui-kit-storybook';
import {Controller, useForm} from 'react-hook-form';

import {WalletConfigInterface} from 'wallets';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';

import * as styled from './WalletLogin.styled';

interface FormDataInterface {
  name: string;
}

interface PropsInterface {
  walletConf: WalletConfigInterface;
  disabled?: boolean;
  onConnected: () => void;
  onError?: (error: any) => void;
  attachSecondaryAccount?: boolean;
}

const WalletLogin: FC<PropsInterface> = ({
  walletConf,
  disabled,
  attachSecondaryAccount = false,
  onConnected,
  onError
}) => {
  const {name, useWallet} = walletConf;
  const {sessionStore, nftStore, signInStore} = useStore();
  const {nftItems, isZeroBalance, requestingFundsStatus, mintingNftStatus} = nftStore;

  const [walletWithFundsIsConnected, setWalletWithFundsIsConnected] = useState(false);

  const accountSelectedAndFundsAcquired =
    walletWithFundsIsConnected || requestingFundsStatus === 'success';

  const {signChallenge, content, account, accountHex} = useWallet({
    appVariables: appVariables as any,
    walletsToDisplay: 'all', // 'withNfts',
    existingNftAddresses: nftItems.map((d) => d.owner)
  });
  console.log('WalletLogin', {name, signChallenge, content, account, accountHex});

  const isWorking = mintingNftStatus === 'pending' || requestingFundsStatus === 'pending';

  const {
    control,
    trigger,
    handleSubmit,
    formState: {errors}
  } = useForm<FormDataInterface>({mode: 'all'});

  const onConnectWallet = handleSubmit((data: FormDataInterface): void => {
    if (!accountHex) {
      return void console.log('Account not selected');
    }

    (attachSecondaryAccount
      ? sessionStore.attachAnotherAccount(accountHex, signChallenge)
      : sessionStore.fetchTokenByWallet2(accountHex, signChallenge)
    )
      .then(() => {
        if (data?.name) {
          return void createNew(data);
        }
        return onConnected();
      })
      .catch((err) => {
        console.log('Error connecting wallet', err);
        onError?.(err);
      });
  });

  const createNew = async (data: FormDataInterface) => {
    if (!account) {
      return;
    }
    signInStore.selectWallet(account);
    await nftStore.subscribeToBalanceChanges(account);

    if (isZeroBalance) {
      nftStore.requestAirdrop(signInStore.wallet);
    } else {
      // there are funds already
      setWalletWithFundsIsConnected(true);
    }
  };

  useEffect(() => {
    const fn = async () => {
      if (requestingFundsStatus !== 'success') {
        return;
      }
      const name = 'asd';
      console.log(`Minting for ${name}`);
      const userID = await nftStore.mintNft(signInStore.wallet, name || '');
      console.log('Minting is successful! userID:', userID);

      // NFT should be minted and accessible by now - if it doesn't happen sometimes
      // we can put some wait here
      await nftStore.fetchNfts();
    };
    fn();
  }, [requestingFundsStatus, nftStore, signInStore.wallet]);

  const innerView = content || (
    <div>
      {!!account && (
        <div>
          <styled.TitleText className="wallet">{account}</styled.TitleText>
        </div>
      )}
    </div>
  );

  // ! Lets make this always true and handle sign up in the parent component
  const accountCanLogin = accountHex && nftStore.nftItems.find((d) => d.owner === account);

  useEffect(() => {
    if (!accountHex) {
      return;
    }
    trigger();
  }, [accountHex, trigger]);

  return (
    <styled.Container>
      <div>mintingNftStatus: {mintingNftStatus}</div>
      <div>requestingFundsStatus: {requestingFundsStatus}</div>
      <div>accountSelectedAndFundsAcquired: {accountSelectedAndFundsAcquired ? 1 : 0}</div>
      <div>walletWithFundsIsConnected: {walletWithFundsIsConnected ? 1 : 0}</div>
      <styled.TitleText>Connect with {name}</styled.TitleText>
      <styled.WalletInnerViewContainer>{innerView}</styled.WalletInnerViewContainer>
      {accountHex && !accountCanLogin && (
        <styled.InputContainer>
          <Controller
            name="name"
            control={control}
            rules={{required: true, maxLength: 32, minLength: 2}}
            render={({field: {onChange, value}}) => (
              <Input placeholder="Enter a name" value={value} onChange={onChange} />
            )}
          />
        </styled.InputContainer>
      )}
      <Button
        label="Connect your wallet"
        icon="wallet"
        disabled={disabled || isWorking || !accountHex || (!accountCanLogin && !!errors.name)}
        wide
        onClick={() => onConnectWallet()}
      />
    </styled.Container>
  );
};

export default observer(WalletLogin);
