import {cast, castToSnapshot, flow, types} from 'mobx-state-tree';
import {ApiPromise, Keyring} from '@polkadot/api';
import {BN, BN_THOUSAND, BN_TWO, BN_ZERO, bnMin, bnToBn, formatBalance} from '@polkadot/util';
import {web3FromAddress} from '@polkadot/extension-dapp';
import {cloneDeep} from 'lodash-es';
import {
  DeriveBalancesAll,
  DeriveSessionProgress,
  DeriveStakingAccount
} from '@polkadot/api-derive/types';
import {u64} from '@polkadot/types-codec/primitive/U64';
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';
import {ResetModel, Dialog, RequestModel} from '@momentum-xyz/core';
import {IconNameType, OptionInterface} from '@momentum-xyz/ui-kit';

import {PolkadotAddress, PolkadotUnlockingDuration, SearchQuery} from 'core/models';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {
  calcUnbondingAmount,
  fetchIpfs,
  isIpfsHash
  // formatExistential
} from 'core/utils';
import {KeyringAddressType} from 'core/types';
import {PayeeEnum, StakingTransactionEnum} from 'core/enums';
import {inputToBN} from 'core/utils';
import {mintNft, mintNftCheckJob} from 'api/repositories';
import {appVariables} from 'api/constants';

import {NftItem, NftItemInterface, StakeDetail, StakeDetailInterface} from './models';

const NFT_MINT_FEE = 100000;
const DEFAULT_COLECTION_ID = 0;

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

const PromiseSleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO change to BN
interface AccountBalanceInterface {
  free: number;
  reserved: number;
  miscFrozen: number;
  feeFrozen: number;
}

const NftStore = types
  .compose(
    ResetModel,
    types.model('NftStore', {
      addresses: types.optional(types.array(PolkadotAddress), []),
      stashAccount: types.maybeNull(PolkadotAddress),
      controllerAccount: types.maybeNull(PolkadotAddress),
      unlockingDuration: types.maybeNull(PolkadotUnlockingDuration),
      chainDecimals: types.maybe(types.number),
      tokenSymbol: '',
      existentialDeposit: types.optional(types.frozen(), 0),
      // minNominatorBond: '',
      ss58Format: types.maybe(types.number),
      isWeb3Injected: false,
      paymentDestination: '',
      customPaymentDestination: '',
      stakingAmount: '',
      unbondAmount: '',
      bondedAddress: types.maybeNull(types.string),
      usedStashAddress: types.maybeNull(types.string),
      transactionType: types.maybeNull(types.enumeration(Object.values(StakingTransactionEnum))),
      transactionFee: '',

      // NFT list + searching
      nftItems: types.optional(types.array(NftItem), []),
      searchedNftItems: types.optional(types.array(types.reference(NftItem)), []),
      searchQuery: types.optional(SearchQuery, {}),

      mintNftRequest: types.optional(RequestModel, {}),
      mintNftCheckJobRequest: types.optional(RequestModel, {}),

      connectToNftItemId: types.maybeNull(types.number),
      stakingAtMe: types.map(StakeDetail),
      stakingAtOthers: types.map(StakeDetail),
      stakingDashorboardDialog: types.optional(Dialog, {}),
      accumulatedRewards: 0,
      balance: types.optional(types.frozen<AccountBalanceInterface>(), {
        free: 0,
        reserved: 0,
        miscFrozen: 0,
        feeFrozen: 0
      }),
      requestingFundsStatus: types.maybeNull(types.enumeration(['pending', 'success', 'error'])),
      mintingNftStatus: types.maybeNull(types.enumeration(['pending', 'success', 'error'])),

      isLoading: false,
      isBalanceLoading: false
    })
  )
  .volatile<{
    channel: ApiPromise | null;
    stashBalanceAll: DeriveBalancesAll | null;
    controllerBalanceAll: DeriveBalancesAll | null;
    customRewardDestinationBalance: DeriveBalancesAll | null;
    stakingInfo: DeriveStakingAccount | null;
    sessionProgress: DeriveSessionProgress | null;
    unsubscribeBalanceSubscription: (() => void) | null;
    unsubscribeStakingSubscription: (() => void) | null;
  }>(() => ({
    channel: null,
    stashBalanceAll: null,
    controllerBalanceAll: null,
    customRewardDestinationBalance: null,
    stakingInfo: null,
    sessionProgress: null,
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
      get stashStakingBalance() {
        let locked, total, transferable, transferableWithoutFee, bonded, redeemable, unbonding;
        if (self.stashBalanceAll && self.stakingInfo) {
          locked = formatBalance(
            self.stashBalanceAll.lockedBalance,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          total = formatBalance(
            self.stashBalanceAll.freeBalance.add(self.stashBalanceAll.reservedBalance),
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          transferable = formatBalance(
            self.stashBalanceAll.availableBalance,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );

          transferableWithoutFee = formatBalance(
            self.stashBalanceAll.freeBalance.gt(self.existentialDeposit)
              ? self.stashBalanceAll.freeBalance.sub(self.existentialDeposit)
              : BN_ZERO,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );

          bonded = formatBalance(
            self.stakingInfo.stakingLedger.active.unwrap(),
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          redeemable = formatBalance(
            self.stakingInfo.redeemable,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
          unbonding = formatBalance(
            calcUnbondingAmount(self.stakingInfo),
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          );
        }

        return {
          locked,
          total,
          transferable,
          transferableWithoutFee,
          bonded,
          redeemable,
          unbonding
        };
      },
      get controllerAccountValidation() {
        const isMappedToAnotherStash =
          self.bondedAddress && self.stashAccount?.address !== self.controllerAccount?.address;
        const isManagingMultipleStashes = !!self.usedStashAddress;
        const sufficientFunds =
          formatBalance(
            self.controllerBalanceAll?.availableBalance,
            SubstrateProvider.FORMAT_OPTIONS,
            self.chainDecimals
          ) === '0';
        return {
          isMappedToAnotherStash,
          isManagingMultipleStashes,
          sufficientFunds,
          isNominatorAcceptable:
            isMappedToAnotherStash || isManagingMultipleStashes || sufficientFunds
        };
      },
      get customRewardDestinationValidation() {
        return (
          self.customRewardDestinationBalance?.freeBalance.isZero() ||
          !self.customPaymentDestination
        );
      },
      get hasCustomRewardValidation() {
        return self.paymentDestination === PayeeEnum.Account
          ? this.customRewardDestinationValidation
          : false;
      },
      // get bondAmountValidation() {
      //   const gtStashFunds =
      //     Number(this.stashStakingBalance.transferableWithoutFee) !== 0 &&
      //     Number(self.stakingAmount) > Number(this.stashStakingBalance.transferableWithoutFee);
      //   const ltThenExistentialDeposit =
      //     Number(self.stakingAmount) < Number(formatExistential(self.existentialDeposit as BN));
      //   const ltMinNominatorBond =
      //     Number(self.minNominatorBond) &&
      //     Number(self.stakingAmount) < Number(self.minNominatorBond);

      //   return {
      //     gtStashFunds,
      //     ltThenExistentialDeposit,
      //     ltMinNominatorBond,
      //     isBondAmountAcceptable: gtStashFunds || ltMinNominatorBond || ltThenExistentialDeposit
      //   };
      // },
      get unlockingProgress() {
        return SubstrateProvider.deriveUnlockingProgress(self.stakingInfo, self.sessionProgress);
      },
      get isStakingAccountUnlocking() {
        const [mapped] = this.unlockingProgress;
        return !(!self.stakingInfo || !mapped.length);
      },
      get isUnbondingPermitted() {
        const isOwnController = this.accountAddresses.includes(
          self.stakingInfo?.controllerId?.toJSON() || ''
        );
        return !(
          !isOwnController ||
          !self.stakingInfo ||
          !self.stakingInfo?.stakingLedger ||
          self.stakingInfo?.stakingLedger.active?.isEmpty
        );
      },
      get unbondAmountValidation() {
        const minAmount = Number(self.unbondAmount) <= 0;
        const maxAmount = Number(self.unbondAmount) > Number(this.stashStakingBalance.bonded);
        return {
          minAmount,
          maxAmount,
          isBondAmountAcceptable: minAmount || maxAmount
        };
      },
      get bondedControllerAddress() {
        return self.stakingInfo?.controllerId?.toJSON();
      },
      get transactionSigner() {
        const signerAddress =
          self.transactionType === StakingTransactionEnum.Bond
            ? self.stashAccount?.address
            : this.bondedControllerAddress;
        return self.addresses.find((account) => account.address === signerAddress);
      },
      get isWithdrawUnbondedPermitted() {
        return !!self.stakingInfo?.redeemable?.gtn(0);
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
      get mutualConnections(): NftItemInterface[] | undefined {
        const mutualConnections: NftItemInterface[] = [];
        self.stakingAtMe.forEach((stakingDetail) => {
          if (self.stakingAtOthers.get(stakingDetail.sourceAddr)) {
            mutualConnections.push(self.getNftByUuid(stakingDetail.sourceAddr));
          }
        });
        return mutualConnections;
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
    formatAmount(amount: number): string {
      if (!self.chainDecimals || !self.tokenSymbol) {
        return 'n/a';
      }
      const amountCoin = amount / Math.pow(10, self.chainDecimals);
      return `${amountCoin.toLocaleString('de-DE', {
        useGrouping: false,
        minimumFractionDigits: 1,
        maximumFractionDigits: 4
      })} ${self.tokenSymbol}`;
    }
  }))
  .actions((self) => ({
    setIsLoading(payload: boolean) {
      self.isLoading = payload;
    },
    setIsBalanceLoading(payload: boolean) {
      self.isBalanceLoading = payload;
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
    setAccumulatedRewards(amount: number) {
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
    // TODO obsolete
    setStakingInfo(payload: DeriveStakingAccount) {
      self.stakingInfo = payload;
    },
    setStashBalanceAll(payload: DeriveBalancesAll) {
      self.stashBalanceAll = payload;
    },
    setControllerBalanceAll(payload: DeriveBalancesAll) {
      self.controllerBalanceAll = payload;
    },
    setCustomRewardDestinationBalance(payload: DeriveBalancesAll) {
      self.customRewardDestinationBalance = payload;
    },
    setSessionProgress(payload: DeriveSessionProgress) {
      self.sessionProgress = payload;
    },
    setInjectAddresses(payload: KeyringAddressType[]) {
      self.addresses = cast(payload);
    },
    setStashAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.stashAccount = cast(cloneDeep(result));
    },
    setControllerAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.controllerAccount = cast(cloneDeep(result));
    },
    setTransactionType(transactionType: StakingTransactionEnum) {
      self.transactionType = cast(transactionType);
    },
    setPaymentDestination(payee: PayeeEnum) {
      self.paymentDestination = cast(payee);
    },
    setCustomPaymentDestination(address: string) {
      self.customPaymentDestination = cast(address);
    },
    setStakingAmount(amount: string) {
      self.stakingAmount = cast(amount);
    },
    setUnbondAmount(amount: string) {
      self.unbondAmount = cast(amount);
    },
    setTransactionFee(amount: string) {
      self.transactionFee = cast(amount);
    },
    derivePaymentDestination() {
      return self.paymentDestination === PayeeEnum.Account
        ? {
            Account: self.customPaymentDestination
          }
        : self.paymentDestination;
    },
    bondExtrinsics(selectedValidators: string[]) {
      const amountBN = inputToBN(self.stakingAmount, self.chainDecimals, self.tokenSymbol);
      const txBatched: Array<SubmittableExtrinsic | undefined> = [];

      const paymentDestination = this.derivePaymentDestination();

      if (self.stashAccount?.address === self.controllerAccount?.address) {
        txBatched.push(
          self.channel?.tx.staking.bond(self.stashAccount?.address, amountBN, paymentDestination)
        );
        txBatched.push(self.channel?.tx.staking.nominate(selectedValidators));
      } else if (self.stashAccount?.address !== self.controllerAccount?.address) {
        txBatched.push(
          self.channel?.tx.staking.bond(self.stashAccount?.address, amountBN, paymentDestination)
        );
        txBatched.push(self.channel?.tx.staking.setController(self.controllerAccount?.address));
        txBatched.push(self.channel?.tx.staking.nominate(selectedValidators));
      }

      return self.channel?.tx.utility.batchAll(txBatched);
    },
    unbondExtrinsics() {
      const amountBN = inputToBN(self.unbondAmount, self.chainDecimals, self.tokenSymbol);
      return self.channel?.tx.staking.unbond(amountBN);
    },
    chillExtrinsics() {
      return self.channel?.tx.staking.chill();
    },
    async withdrawUnbondedExtrinsics() {
      const args = (await self.channel?.tx.staking.withdrawUnbonded.meta.args.length) === 1;
      const spanCount = await self.channel?.query.staking.slashingSpans(self.stakingInfo?.stashId);
      const params = args ? [spanCount] : [];
      return self.channel?.tx.staking.withdrawUnbonded(params);
    },
    async calculateFee(extrinsics: SubmittableExtrinsic | undefined) {
      const calculatedFee = await extrinsics?.paymentInfo(
        self.transactionSigner?.address as string
      );
      const feeFormatted = formatBalance(calculatedFee?.partialFee, {withSiFull: true}, 12);
      this.setTransactionFee(feeFormatted);
    },
    async calculateUnlockingDuration(blocks: BN) {
      const A_DAY = new BN(24 * 60 * 60 * 1000);
      const THRESHOLD = BN_THOUSAND.div(BN_TWO);
      const DEFAULT_TIME = new BN(6_000);

      const time =
        self.channel?.consts.babe?.expectedBlockTime ||
        self.channel?.consts.difficulty?.targetBlockTime ||
        self.channel?.consts.subspace?.expectedBlockTime ||
        ((self.channel?.consts.timestamp?.minimumPeriod as u64).gte(THRESHOLD)
          ? (self.channel?.consts.timestamp.minimumPeriod as u64).mul(BN_TWO)
          : (await self.channel?.query.parachainSystem)
          ? DEFAULT_TIME.mul(BN_TWO)
          : DEFAULT_TIME);

      const interval = bnMin(A_DAY, time as BN);
      const duration = SubstrateProvider.formatUnlockingDuration(interval, bnToBn(blocks));

      self.unlockingDuration = cast(duration);
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
    handleMissingAccount: flow(function* () {
      // TODO - we have a wallet and NFT but DB account is missing
      // We need to request a challenge from BE and sign it and trigger account linking
      // use useEager logic here
    }),
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
          yield PromiseSleep(3000);
          const nftReqCheckJobResult = yield self.mintNftRequest.send(mintNftCheckJob, {
            job_id
          });
          if (!nftReqCheckJobResult) {
            throw new Error('Unable to check minting NFT status');
          }
          const {status} = nftReqCheckJobResult;
          if (status === 'done') {
            break;
          }
        }

        self.setMintingNftStatus('success');
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
      console.log('getNftByWallet', {wallet, address});

      return self.nftItems.find((nftItem) => nftItem.owner === address);
    },
    getNftByUuid: (uuid: string) => {
      return self.nftItems.find((nftItem) => nftItem.uuid === uuid);
    },
    subscribeToStakingInfo: flow(function* (
      address: string,
      userNftItemId: number,
      collectionId = DEFAULT_COLECTION_ID
    ) {
      console.log('fetchStakingInfo', address, userNftItemId, collectionId);
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }

      if (self.unsubscribeStakingSubscription) {
        console.log('Unsubscribe from Staking subscription');
        self.unsubscribeStakingSubscription();
      }

      console.log('subscribe to staking info', address, userNftItemId);
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
              console.log('NFT not found', {destNftItemId, collectionId});
              continue;
            }
            console.log('NFT found', nft);
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
          self.setAccumulatedRewards(Number(rewards) || 0);

          console.log('stakingAtOthers', self.stakingAtOthers);
          console.log('stakingAtMe', self.stakingAtMe);
          console.log('accumulatedRewards', self.accumulatedRewards);
        }
      );
    }),
    stake: flow(function* (
      address: string,
      amount: number,
      itemId: number,
      collectionId: number = DEFAULT_COLECTION_ID
    ) {
      address = formatAddress(address);
      console.log('Stake', itemId, amount, address);
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }
      const {account, options} = yield prepareSignAndSend(address);

      const tx = self.channel.tx.stake.stake(collectionId, itemId, amount);
      console.log('Sign and send', tx);

      try {
        const res = yield tx.signAndSend(account.address, options);
        console.log('res', res);
      } catch (err) {
        console.log('Error staking:', err);
        throw err;
      }
    }),
    unstake: flow(function* (
      address: string,
      amount: number | null,
      itemId: number,
      collectionId: number = DEFAULT_COLECTION_ID
    ) {
      address = formatAddress(address);
      console.log('Unstake', itemId, address);
      if (!self.channel) {
        throw new Error('Channel is not initialized');
      }
      const {account, options} = yield prepareSignAndSend(address);

      const tx = self.channel.tx.stake.unstake(collectionId, itemId, null); // temp comment - amount);
      console.log('Sign and send', tx);

      try {
        const res = yield tx.signAndSend(account.address, options);
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
        const res = yield tx.signAndSend(account.address, options);
        console.log('res', res);
      } catch (err) {
        console.log('Error getting rewards:', err);
        throw err;
      }
    }),
    requestInitialFunds: flow(function* (address: string) {
      console.log('Request initial funds', address);
      self.setRequestFundsStatus('pending');
      if (!self.channel) {
        self.setRequestFundsStatus('error');
        throw new Error('Channel is not initialized');
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
        console.log('Request initial funds success');
      } catch (err) {
        console.log('Error getting initial funds:', err);
        self.setRequestFundsStatus('error');
        throw err;
      }
    })
    // getMinNominatorBond: flow(function* () {
    //   const minNominatorBond = self.channel
    //     ? yield self.channel?.query.staking.minNominatorBond()
    //     : null;
    //   const minNominatorBondFormatted = formatBalance(
    //     minNominatorBond,
    //     SubstrateProvider.FORMAT_OPTIONS,
    //     self.chainDecimals
    //   );
    //   self.minNominatorBond = cast(minNominatorBondFormatted);
    // }),

    // getBondedAddress: flow(function* (address: string) {
    //   const bonded =
    //     self.channel !== null ? yield self.channel.query.staking.bonded(address) : null;
    //   self.bondedAddress = cast(bonded.toJSON());
    // }),
    // getUsedStashAddress: flow(function* (address: string) {
    //   const stash = self.channel !== null ? yield self.channel.query.staking.ledger(address) : null;
    //   const stashId = stash.toJSON() !== null ? stash.toJSON().stash : null;
    //   self.usedStashAddress = cast(stashId);
    // })
  }))
  .actions((self) => ({
    connectToChain: flow(function* () {
      self.channel = yield SubstrateProvider.initAPI();
    }),
    setIsWeb3Injected: flow(function* () {
      const isEnabled = yield SubstrateProvider.isExtensionEnabled();
      self.isWeb3Injected = cast(isEnabled);
    }),
    // initAccounts: flow(function* () {
    //   self.setStashAccount(self.addresses[0].address);
    //   self.setControllerAccount(self.addresses[0].address);
    //   yield self.getBondedAddress(self.addresses[0].address);
    //   yield self.getUsedStashAddress(self.addresses[0].address);
    // }),
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
      // yield self.getMinNominatorBond();
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
          const {free, reserved, miscFrozen, feeFrozen} = balance;
          self.setBalance({
            free: free.toNumber(),
            reserved: reserved.toNumber(),
            miscFrozen: miscFrozen.toNumber(),
            feeFrozen: feeFrozen.toNumber()
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
