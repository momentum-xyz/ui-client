import {cast, flow, types} from 'mobx-state-tree';
import {ApiPromise} from '@polkadot/api';
import {BN, BN_ZERO, formatBalance} from '@polkadot/util';
import {cloneDeep} from 'lodash-es';
import {DeriveStakingAccount} from '@polkadot/api-derive/types';

import {
  PolkadotActiveStake,
  PolkadotAddress,
  PolkadotAddressBalance,
  ResetModel
} from 'core/models';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';
import {calcUnbonding, formatExistential} from 'core/utils';
import {AccountTypeBalance} from 'core/types';
import {Payee} from 'core/enums';

const PolkadotProviderStore = types
  .compose(
    ResetModel,
    types.model('PolkadotProvider', {
      addresses: types.optional(types.array(PolkadotAddress), []),
      stashAccount: types.maybeNull(PolkadotAddress),
      stashAccountBalance: types.maybeNull(PolkadotAddressBalance),
      controllerAccount: types.maybeNull(PolkadotAddress),
      controllerAccountBalance: types.maybeNull(PolkadotAddressBalance),
      activeStakes: types.array(PolkadotActiveStake),
      chainDecimals: types.maybe(types.number),
      tokenSymbol: types.optional(types.string, ''),
      existentialDeposit: types.optional(types.frozen(), 0),
      minNominatorBond: types.optional(types.string, ''),
      ss58Format: types.maybe(types.number),
      isWeb3Injected: false,
      paymentDestination: types.optional(types.string, ''),
      stakingAmount: types.optional(types.string, ''),
      bondedAddress: types.maybeNull(types.string),
      usedStashAddress: types.maybeNull(types.string)
    })
  )
  .views((self) => {
    return {
      get hasAddresses() {
        return !!self.addresses.length;
      },
      get addressOptions() {
        return self.addresses.map((account) => ({
          label: account.meta?.name
            ? `${account.meta?.name} - ${account.address}`
            : account.address,
          value: account.address,
          icon: 'wallet' as IconName
        }));
      },
      get stashAccountBalance() {
        return {

        }
      },
      get controllerAccountValidation() {
        const isMappedToAnotherStash =
          self.bondedAddress && self.stashAccount?.address !== self.controllerAccount?.address;
        const isManagingMultipleStashes = !!self.usedStashAddress;
        const sufficientFunds = self.controllerAccountBalance?.transferable === '0';
        return {
          isMappedToAnotherStash,
          isManagingMultipleStashes,
          sufficientFunds,
          isNominatorAcceptable:
            isMappedToAnotherStash || isManagingMultipleStashes || sufficientFunds
        };
      },
      get bondAmountValidation() {
        const gtStashFunds =
          Number(self.stashAccountBalance?.transferableWithoutFee) !== 0 &&
          Number(self.stakingAmount) > Number(self.stashAccountBalance?.transferableWithoutFee);
        const ltThenExistentialDeposit =
          Number(self.stakingAmount) < Number(formatExistential(self.existentialDeposit as BN));
        const ltMinNominatorBond =
          Number(self.minNominatorBond) &&
          Number(self.stakingAmount) < Number(self.minNominatorBond);

        return {
          gtStashFunds,
          ltThenExistentialDeposit,
          ltMinNominatorBond,
          isBondAmountAcceptable: gtStashFunds || ltMinNominatorBond || ltThenExistentialDeposit
        };
      }
    };
  })
  .volatile<{
    channel: ApiPromise | null;
    stakingInfo: DeriveStakingAccount | null;
    sessionProgress: string | number | boolean | null | undefined;
  }>(() => ({
    channel: null,
    stakingInfo: null,
    sessionProgress: null
  }))
  .actions((self) => ({
    async init() {
      await this.connectToChain();
      await this.setIsWeb3Injected();
      await this.getChainInformation();
      await this.initAccount();
    },
    connectToChain: flow(function* () {
      self.channel = yield SubstrateProvider.initAPI();
    }),
    setIsWeb3Injected: flow(function* () {
      const isEnabled = yield SubstrateProvider.isExtensionEnabled();
      self.isWeb3Injected = cast(isEnabled);
    }),
    getAddresses: flow(function* () {
      const addresses = yield SubstrateProvider.getAddresses(self.ss58Format);
      self.addresses = cast(addresses);
    }),
    getSessionProgress: flow(function* () {
      self.sessionProgress = yield self.channel?.derive.session.progress();
    }),
    getStakingInfo: flow(function* (address: string) {
      self.stakingInfo =
        self.channel !== null ? yield self.channel.derive.staking?.account(address) : null;
    }),
    getBalances: flow(function* (address: string, accountTypeBalance: AccountTypeBalance) {
      const balanceAll =
        self.channel !== null ? yield self.channel.derive.balances?.all(address) : null;

      const stakingInfo: DeriveStakingAccount =
        self.channel !== null ? yield self.channel.derive.staking?.account(address) : null;

      const locked = formatBalance(
        balanceAll.lockedBalance,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const total = formatBalance(
        balanceAll.freeBalance.add(balanceAll.reservedBalance),
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const transferable = formatBalance(
        balanceAll.availableBalance,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );

      const transferableWithoutFee = formatBalance(
        balanceAll.freeBalance.gt(self.existentialDeposit)
          ? balanceAll.freeBalance.sub(self.existentialDeposit)
          : BN_ZERO,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );

      const bonded = formatBalance(
        stakingInfo.stakingLedger.active.unwrap(),
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const redeemable = formatBalance(
        stakingInfo.redeemable,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      const unbonding = formatBalance(
        calcUnbonding(stakingInfo),
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );

      self[accountTypeBalance] = cast({
        locked,
        total,
        transferable,
        bonded,
        redeemable,
        unbonding,
        transferableWithoutFee
      });
    }),
    getBondedAddress: flow(function* (address: string) {
      const bonded =
        self.channel !== null ? yield self.channel.query.staking.bonded(address) : null;
      self.bondedAddress = cast(bonded.toJSON());
    }),
    getUsedStashAddress: flow(function* (address: string) {
      const stash = self.channel !== null ? yield self.channel.query.staking.ledger(address) : null;
      const stashId = stash.toJSON() !== null ? stash.toJSON().stash : null;
      self.usedStashAddress = cast(stashId);
    }),
    getMinNominatorBond: flow(function* () {
      const minNominatorBond = self.channel
        ? yield self.channel?.query.staking.minNominatorBond()
        : null;
      const minNominatorBondFormatted = formatBalance(
        minNominatorBond,
        SubstrateProvider.FORMAT_OPTIONS,
        self.chainDecimals
      );
      self.minNominatorBond = cast(minNominatorBondFormatted);
    }),
    async initAccount() {
      await this.getAddresses();
      await this.getSessionProgress();
      this.setStashAccount(self.addresses[0].address);
      if (self.stashAccount?.address) {
        await this.setControllerAccount(self.stashAccount.address);
        await this.getBondedAddress(self.stashAccount.address);
        await this.getUsedStashAddress(self.stashAccount.address);
      }
    },
    async getChainInformation() {
      self.tokenSymbol = cast(
        self.channel?.registry.chainTokens[0] ? self.channel?.registry.chainTokens[0] : ''
      );

      self.ss58Format = cast(self.channel?.registry.chainSS58);
      self.chainDecimals = cast(self.channel?.registry.chainDecimals[0]);
      formatBalance.setDefaults({
        decimals: self.channel?.registry.chainDecimals[0],
        unit: self.channel?.registry.chainTokens[0]
      });

      self.existentialDeposit = cast(self.channel?.consts.balances.existentialDeposit);
      await this.getMinNominatorBond();
    },
    async setStashAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.stashAccount = cast(cloneDeep(result));
      await this.getBalances(address, 'stashAccountBalance');
      await this.getStakingInfo(address);
    },
    async setControllerAccount(address: string) {
      const result = self.addresses.find((account) => account.address === address);
      self.controllerAccount = cast(cloneDeep(result));
      await this.getBalances(address, 'controllerAccountBalance');
    },
    setPaymentDestination(payee: Payee) {
      self.paymentDestination = cast(payee);
    },
    setStakingAmount(amount: string) {
      self.stakingAmount = cast(amount);
    }
  }));

export {PolkadotProviderStore};
