import {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {Text} from '@momentum-xyz/ui-kit';
import Web3 from 'web3';
import BN from 'bn.js';

import {appVariables} from 'api/constants';
import {WalletSelector} from 'scenes/widgets/pages/LoginWidget/components';
import {WalletConfigInterface, dummyWalletConf} from 'wallets';

import stackingABI from './contract_staking.ABI.json';
import momABI from './contract_MOM.ABI.json';
import faucetABI from './contract_faucet.ABI.json';
import {useStore} from './useStore';

enum TokenEnum {
  MOM_TOKEN = 0,
  DAD_TOKEN = 1
}

export interface UseStakingPropsInterface {
  requiredAccountAddress: string;
}

export const useBlockchain = ({requiredAccountAddress}: UseStakingPropsInterface) => {
  const {selectedWalletConf, setWalletIdByAddress} = useStore().nftStore;

  const [account, setAccount] = useState<string>();
  const [library, setLibrary] = useState<any>();
  const [isWalletActive, setIsWalletActive] = useState<boolean | undefined>();

  const isCorrectAccount = account === requiredAccountAddress;

  const [stakingContract, momContract, faucetContract] = useMemo(() => {
    if (!library) {
      return [];
    }
    const web3 = new Web3(library.provider);

    const stakingContract = new web3.eth.Contract(
      stackingABI as any,
      appVariables.CONTRACT_STAKING_ADDRESS
    );

    const momContract = new web3.eth.Contract(momABI as any, appVariables.CONTRACT_MOM_ADDRESS);

    const faucetContract = new web3.eth.Contract(
      faucetABI as any,
      appVariables.CONTRACT_FAUCET_ADDRESS
    );

    return [stakingContract, momContract, faucetContract];
  }, [library]);

  const stake = useCallback(
    async (worldId: string, amount: BN, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useStaking stake');
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const res = await momContract?.methods
        .approve(appVariables.CONTRACT_STAKING_ADDRESS, amount)
        .send({from: account});
      console.log('useStaking stake approve result', res);

      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useStaking stake into nftId', nftId, amount, tokenKind);
      const result = await stakingContract?.methods
        .stake(nftId, amount, tokenKind)
        .send({from: account});
      console.log('useStaking stake result', result);
    },
    [momContract, account, stakingContract, isCorrectAccount]
  );

  const unstake = useCallback(
    async (worldId: string, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useStaking unstake');
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useStaking unstake from nftId', nftId, tokenKind);
      const result = await stakingContract?.methods.unstake(nftId, tokenKind).send({from: account});
      console.log('useStaking unstake result', result);
    },
    [account, stakingContract, isCorrectAccount]
  );

  const getTokens = useCallback(
    async (tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useBlockchainAirdrop getTokens', {tokenKind});
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const result = await faucetContract?.methods.get_tokens(tokenKind).send({from: account});
      console.log('useBlockchainAirdrop getTokens result', result);
    },
    [account, faucetContract, isCorrectAccount]
  );

  const claimRewards = useCallback(async () => {
    console.log('useStaking claimRewards');
    if (!isCorrectAccount) {
      console.log('Incorrect account selected');
      return;
    }

    const result = await stakingContract?.methods.claim_rewards().send({from: account});
    console.log('useStaking claimRewards result', result);
  }, [stakingContract, account, isCorrectAccount]);

  const walletSelectContent =
    selectedWalletConf === dummyWalletConf ? (
      <WalletSelector
        onSelect={(walletConf) => {
          if (walletConf) {
            setWalletIdByAddress(requiredAccountAddress, walletConf.id);
          }
        }}
      />
    ) : (
      <WalletSelectHelper
        key={selectedWalletConf.id}
        walletConf={selectedWalletConf}
        requiredAccountAddress={requiredAccountAddress}
        onActivationDone={setIsWalletActive}
        onSelectedAccountChanged={setAccount}
        onLibraryLoaded={setLibrary}
      />
    );

  return {
    isBlockchainReady: isWalletActive && isCorrectAccount,
    account,
    walletSelectContent,
    stake,
    unstake,
    claimRewards,
    getTokens
  };
};

interface WalletSelectHelperPropsInterface {
  walletConf: WalletConfigInterface;
  requiredAccountAddress: string;
  onActivationDone: (isSuccess: boolean) => void;
  onSelectedAccountChanged: (account: string) => void;
  onLibraryLoaded: (library: any) => void;
}

const WalletSelectHelper: FC<WalletSelectHelperPropsInterface> = ({
  walletConf,
  requiredAccountAddress,
  onActivationDone,
  onSelectedAccountChanged,
  onLibraryLoaded
}) => {
  const {useWallet} = walletConf;
  const {
    web3Library: library,
    account,
    activate,
    isActive
  } = useWallet({appVariables: appVariables as any});
  console.log('useStaking', {library, account, activate, isActive, requiredAccountAddress});

  useEffect(() => {
    if (account) {
      onSelectedAccountChanged(account);
    }
  }, [account, onSelectedAccountChanged]);

  useEffect(() => {
    if (library) {
      onLibraryLoaded(library);
    }
  }, [library, onLibraryLoaded]);

  useEffect(() => {
    activate()
      .catch((err) => {
        console.log('useStaking activate err', err);
        onActivationDone(false);
      })
      .finally(() => onActivationDone(true));
  }, [activate, onActivationDone]);

  if (account && account !== requiredAccountAddress) {
    return <Text text="Please select another account in the wallet" size="m" />;
  }

  if (isActive && !library) {
    return <Text text="This account cannot be used" size="m" />;
  }

  return null;
};
