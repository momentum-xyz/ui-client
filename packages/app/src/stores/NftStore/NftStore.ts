import {cast, castToSnapshot, flow, getSnapshot, types} from 'mobx-state-tree';
import {ApiPromise, Keyring} from '@polkadot/api';
import {BN, formatBalance} from '@polkadot/util';
import {web3FromAddress} from '@polkadot/extension-dapp';
import {
  ResetModel,
  Dialog,
  RequestModel,
  canRequestAirdrop,
  saveLastAirdropInfo
} from '@momentum-xyz/core';
import {IconNameType, OptionInterface} from '@momentum-xyz/ui-kit';

import {PolkadotAddress, SearchQuery} from 'core/models';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {
  fetchIpfs,
  isIpfsHash,
  wait
  // formatExistential
} from 'core/utils';
import {KeyringAddressType} from 'core/types';
import {mintNft, mintNftCheckJob} from 'api/repositories';
import {appVariables} from 'api/constants';
import {MintNftCheckJobResponse} from 'api';

import {NftItem, NftItemInterface, StakeDetail, StakeDetailInterface} from './models';

const NFT_MINT_FEE = 100000;
const MIN_AMOUNT_TO_GET_REWARDS = 100_000_000;

const prepareSignAndSend = async (address: string) => {
  // there's alternative way for this in useEager
  const keyring = new Keyring({type: 'sr25519'});
  const account = keyring.addFromAddress(address);
  console.log('Account', account, account.address);

  const injector = await web3FromAddress(account.address);
  return {account, options: {signer: injector.signer}};
};

// 2 - kusama:   D5XnCra5cbgdkRszMckp9s3tQM8sujMCYJ71DB8pBSpCwtv
// 42 - westend: 5CZv7tWhTFakt6cSDeohvCW3jp4u5EvAkATMcYuBLPEKU23e
const formatAddress = (address: string, network = 42) => {
  const keyring = new Keyring({type: 'sr25519'});
  return keyring.encodeAddress(address, network);
};

interface AccountBalanceInterface {
  free: BN;
  reserved: BN;
  // miscFrozen: number;
  // feeFrozen: number;
}

const NftStore = types
  .compose(
    ResetModel,
    types.model('NftStore', {
      addresses: types.optional(types.array(PolkadotAddress), []),
      chainDecimals: types.maybe(types.number),
      tokenSymbol: '',
      existentialDeposit: types.optional(types.frozen(), 0),
      ss58Format: types.maybe(types.number),
      isWeb3Injected: false,

      // NFT list + searching
      nftItems: types.optional(types.array(NftItem), []),
      searchedNftItems: types.optional(types.array(types.reference(NftItem)), []),
      searchQuery: types.optional(SearchQuery, {}),

      mintNftRequest: types.optional(RequestModel, {}),
      mintNftCheckJobRequest: types.optional(RequestModel, {}),

      connectToNftItemId: types.maybeNull(types.number),
      initialStakingInfoLoaded: false,
      stakingAtMe: types.map(StakeDetail),
      stakingAtOthers: types.map(StakeDetail),
      stakingDashorboardDialog: types.optional(Dialog, {}),
      accumulatedRewards: types.frozen(new BN(0)),
      balance: types.optional(types.frozen<AccountBalanceInterface>(), {
        free: new BN(0),
        reserved: new BN(0)
        // miscFrozen: 0,
        // feeFrozen: 0
      }),
      requestingFundsStatus: types.maybeNull(types.enumeration(['pending', 'success', 'error'])),
      mintingNftStatus: types.maybeNull(types.enumeration(['pending', 'success', 'error'])),

      isLoading: false,
      isBalanceLoading: false
    })
  )
  .volatile<{
    channel: ApiPromise | null;
    unsubscribeBalanceSubscription: (() => void) | null;
    unsubscribeStakingSubscription: (() => void) | null;
  }>(() => ({
    channel: null,
    unsubscribeStakingSubscription: null,
    unsubscribeBalanceSubscription: null
  }))
  .views((self) => {
    return {
      get hasAddresses() {
        return !!self.addresses.length;
      },
      get accountAddresses() {
        return self.addresses.map((account) => account.address);
      },
      get addressOptions() {
        return self.addresses.map((account) => ({
          label: account.meta?.name
            ? `${account.meta?.name} - ${account.address}`
            : account.address,
          value: account.address,
          icon: 'wallet' as IconNameType
        }));
      },
      get accountOptions(): OptionInterface[] {
        return self.addresses.map((account) => ({
          label: account.meta?.name || account.address,
          value: account.address,
          icon: 'polkadotprofile'
        }));
      },
      get mutualStakingAddresses(): string[] {
        const mutualStakingAddresses: string[] = [];
        self.stakingAtMe.forEach((stakingDetail) => {
          if (self.stakingAtOthers.get(stakingDetail.sourceAddr)) {
            mutualStakingAddresses.push(stakingDetail.sourceAddr);
          }
        });
        return mutualStakingAddresses;
      },
      get mutualConnections(): NftItemInterface[] {
        const mutualConnections: NftItemInterface[] = [];
        self.stakingAtMe.forEach((stakingDetail) => {
          if (self.stakingAtOthers.get(stakingDetail.sourceAddr)) {
            mutualConnections.push(self.getNftByWallet(stakingDetail.sourceAddr));
          }
        });
        return mutualConnections;
      },
      isAlreadyConnected(address: string): boolean {
        return self.stakingAtOthers.has(address);
      },
      balanseFormat(amount: BN) {
        return formatBalance(
          amount,
          {withSi: true, withUnit: self.tokenSymbol},
          self.chainDecimals
        );
      }
    };
  })
  .views((self) => ({
    get accountsWithNftsOptions(): OptionInterface[] {
      return self.accountOptions.filter((account) =>
        self.nftItems.some((nft) => nft.owner === account.value)
      );
    },
    get accountsWithoutNftsOptions(): OptionInterface[] {
      return self.accountOptions.filter(
        (account) => !self.nftItems.some((nft) => nft.owner === account.value)
      );
    },
    get isZeroBalance(): boolean {
      return self.balance.free.isZero();
    },
    get balanceTotal(): string {
      return self.balanseFormat(self.balance.free);
    },
    get balanceReserved(): string {
      return self.balanseFormat(self.balance.reserved);
    },
    get balanceTransferrableBN(): BN {
      return self.balance.free.clone().sub(self.balance.reserved).sub(self.existentialDeposit);
    }
  }))
  .views((self) => ({
    get balanceTransferrable(): string {
      return self.balanseFormat(self.balanceTransferrableBN);
    },
    canBeStaked(amount: number): boolean {
      try {
        return self.balanceTransferrableBN.gte(new BN(amount));
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    get accountAccumulatedRewards(): string {
      return self.balanseFormat(self.accumulatedRewards);
    },
    get canReceiveAccumulatedRewards(): boolean {
      return self.accumulatedRewards.gt(new BN(MIN_AMOUNT_TO_GET_REWARDS));
    }
  }))
  .actions((self) => ({
    setIsLoading(payload: boolean) {
      self.isLoading = payload;
    },
    setIsBalanceLoading(payload: boolean) {
      self.isBalanceLoading = payload;
    },
    setInitialStakingInfoLoaded(initialStakingInfoLoaded: boolean) {
      self.initialStakingInfoLoaded = initialStakingInfoLoaded;
    },
    setNftItems(items: NftItemInterface[]) {
      self.nftItems = cast(items);
    },
    setConnectToNftItemId(itemId: number | null) {
      self.connectToNftItemId = itemId;
    },
    setRequestFundsStatus(status: 'pending' | 'success' | 'error') {
      self.requestingFundsStatus = status;
    },
    setMintingNftStatus(status: 'pending' | 'success' | 'error') {
      self.mintingNftStatus = status;
    },
    setBalance(payload: AccountBalanceInterface) {
      self.balance = payload;
    },
    setAccumulatedRewards(amount: BN) {
      self.accumulatedRewards = amount;
    },
    setStakingInfos(
      stakingAtOthers: Map<string, StakeDetailInterface>,
      stakingAtMe: Map<string, StakeDetailInterface>
    ) {
      console.log('setStakingInfos', stakingAtOthers, stakingAtMe);
      self.stakingAtMe.clear();
      stakingAtMe.forEach((v, k) => {
        self.stakingAtMe.set(k, v);
      });
      self.stakingAtOthers.clear();
      stakingAtOthers.forEach((v, k) => {
        self.stakingAtOthers.set(k, v);
      });
    },
    setInjectAddresses(payload: KeyringAddressType[]) {
      self.addresses = cast(payload);
    }
  }))
  .actions((self) => ({
    getAddresses: flow(function* () {
      yield SubstrateProvider.getAddresses(self.ss58Format).then((injectedAccounts) => {
        SubstrateProvider.loadToKeyring(
          injectedAccounts,
          self.ss58Format,
          self.channel?.genesisHash
        );
      });
      const injectedAddresses = SubstrateProvider.getKeyringAddresses();
      console.log('injectedAddresses', injectedAddresses, 'ss58Format', self.ss58Format);
      self.setInjectAddresses(injectedAddresses as KeyringAddressType[]);
    }),
    fetchNfts: flow(function* () {
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }

      const nftsItemsInfos = yield self.channel.query.uniques.asset.keys();
      console.log('nftsItemsInfos', nftsItemsInfos);
      const collectionItemIds = nftsItemsInfos.map((nftItemInfo: any) => {
        const [collectionId, itemId] = nftItemInfo.args;
        return [collectionId.toNumber(), itemId.toNumber()];
      });
      console.log('collectionItemIds', collectionItemIds);
      const [itemMetadatas, nftItemsDetailedInfos] = yield Promise.all([
        self.channel.query.uniques.instanceMetadataOf.multi(collectionItemIds),
        self.channel.query.uniques.asset.multi(collectionItemIds)
      ]);

      console.log('metadatas', itemMetadatas, itemMetadatas?.toJSON?.());
      const nftItems: NftItemInterface[] = yield Promise.all(
        itemMetadatas.map(
          async (itemMedadata: any, index: number): Promise<NftItemInterface | null> => {
            const [collectionId, itemId] = collectionItemIds[index];
            const data = itemMedadata?.unwrapOr(null)?.data?.toHuman();
            // console.log('data', data);
            const itemDetailedInfo = nftItemsDetailedInfos[index];
            // console.log('itemDetailedInfo', itemDetailedInfo.toHuman());
            const owner = itemDetailedInfo.unwrapOr(null)?.owner?.toString();

            if (!data) {
              return null;
            }

            let metadataStr: string | null = data as string;
            try {
              if (isIpfsHash(data)) {
                console.log('fetch from IPFS', data);
                // TODO timeout
                metadataStr = await fetchIpfs(data);
              }

              if (!metadataStr) {
                return null;
              }

              let metadata = JSON.parse(metadataStr);
              if (Array.isArray(metadata)) {
                const [uuid, name, ipfs, image] = metadata;
                metadata = {uuid, ipfs, name, image};
                if (isIpfsHash(ipfs)) {
                  console.log('fetch from IPFS', ipfs);
                  // TODO timeout
                  metadataStr = await fetchIpfs(ipfs);
                  if (metadataStr) {
                    const additionalMetadata = JSON.parse(metadataStr);
                    metadata = {...metadata, ...additionalMetadata};
                  }
                }
              }

              if (!metadata?.name || !metadata?.uuid) {
                console.log('Incomplete metadata', metadata);
                return null;
              }

              return {
                collectionId,
                id: itemId,
                owner,
                ...metadata
              };
            } catch (e) {
              console.log('Unable to parse/fetch NFT metadata', data, '| Error:', e);
            }

            return null;
          }
        )
      ).then(
        (nftItems: Array<NftItemInterface | null>) =>
          nftItems.filter((nftItem) => !!nftItem) as NftItemInterface[]
      );

      console.log('NftItems', nftItems);

      self.setNftItems(nftItems);
    }),
    searchNft(): void {
      self.searchedNftItems = cast([]);
      const query = self.searchQuery.query.toLowerCase();

      self.searchedNftItems = castToSnapshot(
        self.nftItems.filter((i) => i.name.toLocaleLowerCase().includes(query))
      );
    },
    mintNft: flow(function* (address: string, name: string, image?: string) {
      console.log('Mint NFT', address);
      if (!self.channel) {
        self.setMintingNftStatus('error');
        throw new Error('Channel is not initialized');
      }
      self.setMintingNftStatus('pending');

      const {account, options} = yield prepareSignAndSend(address);

      try {
        const {NFT_ADMIN_ADDRESS} = appVariables;
        console.log('Create transfer funds for minting NFT', {
          NFT_ADMIN_ADDRESS,
          NFT_MINT_FEE
        });
        const transfer = self.channel.tx.balances.transfer(NFT_ADMIN_ADDRESS, NFT_MINT_FEE);
        console.log('Sign and send', transfer);

        const block_hash = yield new Promise((resolve, reject) => {
          transfer
            .signAndSend(account.address, options, ({status}) => {
              if (status.isInBlock) {
                const blockHash = status.asInBlock.toString();
                console.log(`Completed at block hash #${blockHash}`);
                resolve(blockHash);
              } else {
                console.log(`Current transaction status: ${status.type}`);
              }
            })
            .catch(reject);
        });

        console.log('Request BE to mint the NFT', {block_hash, address});

        const nftReqResult = yield self.mintNftRequest.send(mintNft, {
          block_hash,
          wallet: address,
          name,
          image: image || 'https://picsum.photos/102'
        });
        console.log('nftReqResult', nftReqResult);
        if (!nftReqResult) {
          throw new Error('Unable to mint NFT');
        }
        const {job_id} = nftReqResult;

        for (let i = 0; i < 50; i++) {
          yield wait(3000);
          const nftReqCheckJobResult: MintNftCheckJobResponse = yield self.mintNftRequest.send(
            mintNftCheckJob,
            {
              job_id
            }
          );
          if (!nftReqCheckJobResult) {
            throw new Error('Unable to check minting NFT status');
          }
          const {status, nodeJSOut} = nftReqCheckJobResult;
          if (status === 'done') {
            const userID = nodeJSOut?.data?.userID;
            self.setMintingNftStatus('success');
            return userID;
          }
        }

        throw new Error('Timeout during minting');
      } catch (err) {
        console.log('err', err);
        self.setMintingNftStatus('error');
        throw err;
      }
    }),
    getAddressByWallet: (wallet: string) => {
      return self.addresses.find((i) => i.address === wallet);
    },
    getNftByWallet: (wallet: string) => {
      const address = formatAddress(wallet);

      return self.nftItems.find((nftItem) => nftItem.owner === address);
    },
    getNftByUuid: (uuid: string) => {
      return self.nftItems.find((nftItem) => nftItem.uuid === uuid);
    },
    subscribeToStakingInfo: flow(function* (address: string, userNftItemId?: number) {
      const collectionId = +appVariables.NFT_COLLECTION_ODYSSEY_ID;
      console.log('fetchStakingInfo', address, userNftItemId, collectionId);
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }

      userNftItemId = userNftItemId ?? self.getNftByWallet(address)?.id;

      if (self.unsubscribeStakingSubscription) {
        console.log('Unsubscribe from Staking subscription');
        self.unsubscribeStakingSubscription();
      }

      console.log('subscribe to staking info', {address, userNftItemId, collectionId});
      self.unsubscribeStakingSubscription = yield self.channel.queryMulti(
        [
          [self.channel.query.stake.stakingAt, address],
          [self.channel.query.stake.staked, [collectionId, userNftItemId]],
          [self.channel.query.stake.stakersRewards, address]
        ],
        ([stakingAt, staked, rewards]) => {
          console.log('stakingAt', stakingAt?.toHuman());
          console.log('staked', staked?.toHuman());
          console.log('rewards', rewards?.toHuman());
          const stakingAtArr = (stakingAt as any)?.unwrapOr(null) || [];
          const stakedArr = (staked as any)?.unwrapOr(null) || [];

          const stakingAtOthers = new Map<string, StakeDetailInterface>();
          for (const stakingAtItem of stakingAtArr) {
            const {
              nfts: [collectionIdStr, itemIdStr],
              value: valueAmountStr
            } = stakingAtItem;
            const destNftItemId = +itemIdStr;
            const collectionId = +collectionIdStr;
            const amount = +valueAmountStr;

            const nft = self.nftItems.find(
              (nftItem) => nftItem.id === destNftItemId && nftItem.collectionId === collectionId
            );
            if (!nft) {
              console.log("Other person's NFT not found for staking info", {
                destNftItemId,
                collectionId
              });
              continue;
            }
            // console.log('NFT found',  nft);
            const destAddr = String(nft.owner);

            stakingAtOthers.set(destAddr, {
              amount,
              destAddr,
              sourceAddr: address
            });
          }

          const stakingAtMe = new Map<string, StakeDetailInterface>();
          for (const stakedItem of stakedArr) {
            const {accountId: sourceAddr, value: valueAmountStr} = stakedItem;
            const amount = +valueAmountStr;

            stakingAtMe.set(String(sourceAddr), {
              amount: amount,
              sourceAddr: String(sourceAddr),
              destAddr: address
            });
          }

          self.setStakingInfos(stakingAtOthers, stakingAtMe);
          self.setAccumulatedRewards(rewards as any);
          self.setInitialStakingInfoLoaded(true);

          console.log('stakingAtOthers', getSnapshot(self.stakingAtOthers));
          console.log('stakingAtMe', getSnapshot(self.stakingAtMe));
          console.log('accumulatedRewards', self.accumulatedRewards);
        }
      );
    }),
    stake: flow(function* (address: string, amount: number, itemId: number) {
      const collectionId = +appVariables.NFT_COLLECTION_ODYSSEY_ID;
      address = formatAddress(address);
      console.log('Stake', itemId, amount, address);
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }
      const {account, options} = yield prepareSignAndSend(address);

      const tx = self.channel.tx.stake.stake(collectionId, itemId, amount);
      console.log('Sign and send', tx);

      try {
        const res = yield tx.signAndSend(account.address, options, ({status}) => {
          if (status.isInBlock) {
            const blockHash = status.asInBlock.toString();
            console.log(`Completed at block hash #${blockHash}`);
            // resolve(blockHash);
          } else {
            console.log(`Current transaction status: ${status.type}`);
          }
        });
        console.log('res', res);
      } catch (err) {
        console.log('Error staking:', err);
        throw err;
      }
    }),
    unstake: flow(function* (address: string, amount: number | null, itemId: number) {
      const collectionId = +appVariables.NFT_COLLECTION_ODYSSEY_ID;
      address = formatAddress(address);
      console.log('Unstake', itemId, address);
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }
      const {account, options} = yield prepareSignAndSend(address);

      const tx = self.channel.tx.stake.unstake(collectionId, itemId, null);
      console.log('Sign and send', tx);

      try {
        const res = yield tx.signAndSend(account.address, options, ({status}) => {
          if (status.isInBlock) {
            const blockHash = status.asInBlock.toString();
            console.log(`Completed at block hash #${blockHash}`);
            // resolve(blockHash);
          } else {
            console.log(`Current transaction status: ${status.type}`);
          }
        });
        console.log('res', res);
      } catch (err) {
        console.log('Error unstaking:', err);
        throw err;
      }
    }),
    getRewards: flow(function* (address: string) {
      address = formatAddress(address);
      console.log('Get rewards', address);
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }
      const {account, options} = yield prepareSignAndSend(address);

      const tx = self.channel.tx.stake.getRewards();
      console.log('Sign and send', tx);

      try {
        const res = yield tx.signAndSend(account.address, options, ({status}) => {
          if (status.isInBlock) {
            const blockHash = status.asInBlock.toString();
            console.log(`Completed at block hash #${blockHash}`);
            // resolve(blockHash);
          } else {
            console.log(`Current transaction status: ${status.type}`);
          }
        });
        console.log('res', res);
      } catch (err) {
        console.log('Error getting rewards:', err);
        throw err;
      }
    }),
    requestAirdrop: flow(function* (address: string) {
      console.log('Request airdrop', address);
      self.setRequestFundsStatus('pending');
      if (!self.channel) {
        self.setRequestFundsStatus('error');
        throw new Error('Channel is not initialized');
      }

      if (!canRequestAirdrop()) {
        throw new Error('Wait at least 24 hours before requesting airdrop again');
      }

      const {account, options} = yield prepareSignAndSend(address);
      const tx = self.channel.tx.faucet.getTokens();

      console.log('Sign and send', tx);
      try {
        yield new Promise((resolve, reject) => {
          tx.signAndSend(account.address, options, ({status}) => {
            if (status.isInBlock) {
              const blockHash = status.asInBlock.toString();
              console.log(`Completed at block hash #${blockHash}`);
              resolve(blockHash);
            } else {
              console.log(`Current transaction status: ${status.type}`);
            }
          }).catch(reject);
        });
        self.setRequestFundsStatus('success');
        saveLastAirdropInfo();
        console.log('Request airdrop success');
      } catch (err) {
        console.log('Error getting airdrop:', err);
        self.setRequestFundsStatus('error');
        throw err;
      }
    })
  }))
  .actions((self) => ({
    connectToChain: flow(function* () {
      self.channel = yield SubstrateProvider.initAPI();
    }),
    setIsWeb3Injected: flow(function* () {
      const isEnabled = yield SubstrateProvider.isExtensionEnabled();
      self.isWeb3Injected = cast(isEnabled);
    }),
    getChainInformation() {
      self.tokenSymbol = cast(
        self.channel?.registry.chainTokens[0] ? self.channel?.registry.chainTokens[0] : ''
      );

      self.ss58Format = cast(self.channel?.registry.chainSS58);
      self.chainDecimals = cast(self.channel?.registry.chainDecimals[0]);
      SubstrateProvider.setDefaultBalanceFormatting(
        self.channel?.registry.chainDecimals[0],
        self.channel?.registry.chainTokens[0]
      );

      self.existentialDeposit = cast(self.channel?.consts.balances.existentialDeposit);
      console.log(
        'Chain Info',
        self.tokenSymbol,
        'ss58Format',
        self.ss58Format,
        'chainDecimals',
        self.chainDecimals,
        'existentialDeposit',
        self.existentialDeposit
      );
    },
    subscribeToBalanseChanges: flow(function* (address: string) {
      if (!self.channel) {
        return;
      }
      if (self.unsubscribeBalanceSubscription) {
        console.log('Unsubscribe from balance subscription');
        self.unsubscribeBalanceSubscription();
      }
      self.setIsBalanceLoading(true);
      self.unsubscribeBalanceSubscription = yield self.channel.query.system.account(
        address,
        ({nonce, data: balance}: any) => {
          console.log(
            `free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`
          );
          console.log('balance', balance.toHuman(), balance);
          const {
            free,
            reserved
            //  miscFrozen, feeFrozen
          } = balance;
          self.setBalance({
            free,
            reserved
          });
          self.setIsBalanceLoading(false);
        }
      );
    })
  }))
  .actions((self) => ({
    init: flow(function* () {
      self.setIsLoading(true);

      yield self.connectToChain();
      yield self.fetchNfts();

      self.getChainInformation();

      self.setIsLoading(false);
    }),
    initWeb3ExtensionIfNeeded: flow(function* () {
      if (!self.isWeb3Injected) {
        yield self.setIsWeb3Injected();
        yield self.getAddresses();
      }
    })
  }));

export {NftStore};
