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

const DELAY_REFRESH_DATA_MS = 2000;

export interface UseBlockchainPropsInterface {
  requiredAccountAddress: string;
}

export const useBlockchain = ({requiredAccountAddress}: UseBlockchainPropsInterface) => {
  const {selectedWalletConf, setWalletIdByAddress, loadMyWallets, loadMyStakes} =
    useStore().nftStore;

  const [account, setAccount] = useState<string>();
  const [library, setLibrary] = useState<any>();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
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
      console.log('useBlockchain stake');
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const res = await momContract?.methods
        .approve(appVariables.CONTRACT_STAKING_ADDRESS, amount)
        .send({from: account});
      console.log('useBlockchain stake approve result', res);

      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useBlockchain stake into nftId', nftId, amount, tokenKind);
      const result = await stakingContract?.methods
        .stake(nftId, amount, tokenKind)
        .send({from: account});
      console.log('useBlockchain stake result', result);

      setTimeout(() => loadMyStakes().catch(console.error), DELAY_REFRESH_DATA_MS);

      return result;
    },
    [momContract, account, stakingContract, isCorrectAccount, loadMyStakes]
  );

  const unstake = useCallback(
    async (worldId: string, tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useBlockchain unstake');
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const nftId = '0x' + worldId.replace(/-/g, '');

      console.log('useBlockchain unstake from nftId', nftId, tokenKind);
      const result = await stakingContract?.methods.unstake(nftId, tokenKind).send({from: account});
      console.log('useBlockchain unstake result', result);

      setTimeout(() => loadMyStakes().catch(console.error), DELAY_REFRESH_DATA_MS);
    },
    [account, stakingContract, isCorrectAccount, loadMyStakes]
  );

  const getTokens = useCallback(
    async (tokenKind = TokenEnum.MOM_TOKEN) => {
      console.log('useBlockchain getTokens', {tokenKind});
      if (!isCorrectAccount) {
        console.log('Incorrect account selected');
        return;
      }

      const result = await faucetContract?.methods.get_tokens(tokenKind).send({from: account});
      console.log('useBlockchain getTokens result', result);

      setTimeout(() => loadMyWallets().catch(console.error), DELAY_REFRESH_DATA_MS);
    },
    [account, faucetContract, isCorrectAccount, loadMyWallets]
  );

  const claimRewards = useCallback(async () => {
    console.log('useBlockchain claimRewards');
    if (!isCorrectAccount) {
      console.log('Incorrect account selected');
      return;
    }

    const result = await stakingContract?.methods.claim_rewards().send({from: account});
    console.log('useBlockchain claimRewards result', result);

    setTimeout(() => loadMyWallets().catch(console.error), DELAY_REFRESH_DATA_MS);
  }, [stakingContract, account, isCorrectAccount, loadMyWallets]);

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
        onNetworkStatusChanged={setIsWrongNetwork}
      />
    );

  return {
    isBlockchainReady: isWalletActive && isCorrectAccount && !isWrongNetwork,
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
  onNetworkStatusChanged: (isWrongNetwork: boolean) => void;
}

const WalletSelectHelper: FC<WalletSelectHelperPropsInterface> = ({
  walletConf,
  requiredAccountAddress,
  onActivationDone,
  onSelectedAccountChanged,
  onLibraryLoaded,
  onNetworkStatusChanged
}) => {
  const {useWallet} = walletConf;
  const {
    web3Library: library,
    chainId,
    account,
    activate,
    isActive
  } = useWallet({appVariables: appVariables as any});
  console.log('WalletSelectHelper', {library, account, activate, isActive, requiredAccountAddress});

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
        console.log('WalletSelectHelper activate err', err);
        onActivationDone(false);
      })
      .finally(() => onActivationDone(true));
  }, [activate, onActivationDone]);

  const isWrongNetwork = !!chainId && chainId !== appVariables.BLOCKCHAIN_ID;

  useEffect(() => {
    onNetworkStatusChanged(isWrongNetwork);
    // TODO switch automatically
  }, [isWrongNetwork, onNetworkStatusChanged]);

  if (isActive && !library) {
    return <Text text="This account cannot be used" size="m" />;
  }

  if (isWrongNetwork) {
    console.log('WalletSelectHelper current chainId', chainId, library);
    return <Text text="Please switch to Arbitrum network in the wallet" size="m" />;
  }

  if (account && account !== requiredAccountAddress) {
    return <Text text="Please switch to selected account in the wallet" size="m" />;
  }

  return null;
};
