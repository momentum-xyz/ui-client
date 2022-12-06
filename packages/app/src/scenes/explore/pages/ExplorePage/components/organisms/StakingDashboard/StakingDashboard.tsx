import React, {FC, useMemo, useState} from 'react';
import {Button, Heading, Input, TabBar, TabBarTabInterface, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {t} from 'i18next';
import {formatTokenAmount} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './StakingDashboard.styled';

const tabBarTabs: TabBarTabInterface[] = [
  {
    id: 'wallet',
    label: 'My Wallet',
    title: 'My Wallet',
    icon: 'wallet',
    disabled: true
  },
  {
    id: 'confirm',
    title: 'Authorize',
    label: 'Authorize',
    icon: 'check',
    disabled: true
  }
];

interface PropsInterface {
  onComplete: () => void;
}

const StakingDashboard: FC<PropsInterface> = ({onComplete}) => {
  const {authStore, nftStore} = useStore();
  const {wallet: authWallet} = authStore;
  const {addresses, accountOptions} = nftStore;
  // TODO load staking info for all accounts
  const {stakingAtOthers, balance, accumulatedRewards} = nftStore;

  const [wallet = addresses[0]?.address] = useState(authWallet);
  const nft = wallet ? nftStore.getNftByWallet(wallet) : null;

  const [getRewards, setGetRewards] = useState(false);

  const [unstakeFrom, setUnstakeFrom] = useState<string | null>(null);
  const unstakeFromDetail = unstakeFrom ? stakingAtOthers.get(unstakeFrom) : null;
  const [_amount, setAmount] = useState<number | null>(null);
  const amount = _amount || unstakeFromDetail?.amount || 0;

  // TODO: fizlin - replace with real data
  const stakes = useMemo(
    () =>
      new Array(3).fill({
        user: 'Satoshi',
        staked: 2.5,
        reward: 0.3
      }) as {user: string; staked: number; reward: number}[],
    []
  );
  console.log(
    accountOptions // get initiator wallet from here
  );
  const initiatorWallet = useMemo(() => 'EDhjohSyRxb....', []);

  const balanceSections = useMemo(() => {
    const balanceEntities = [
      {label: 'Account Balance', value: Number(balance.free)},
      {label: 'Transferable', value: Number(balance.free) - Number(balance.reserved)},
      {label: 'Stacked', value: null},
      {label: 'Unbonding', value: null}
    ];

    return balanceEntities.map(({label, value}) => {
      const balanceValueText = value !== null ? formatTokenAmount(value) : '-';
      return (
        <styled.BalanceEntityContainer key={label}>
          <Heading type="h4" align="left" label={label} />
          <Text size="xxs" align="left" text={`${balanceValueText} MTM`}></Text>
        </styled.BalanceEntityContainer>
      );
    });
  }, [balance]);

  const activeTab = getRewards || !!unstakeFrom ? tabBarTabs[1] : tabBarTabs[0];

  console.log('StakingForm', {wallet, addresses, authWallet, amount});

  const onGetRewards = () => {
    console.log('getRewards', wallet);

    nftStore
      .getRewards(wallet)
      .then(() => {
        console.log('getRewards success');
        toast.info(
          <ToastContent
            // headerIconName="calendar"
            title={"You've got rewards!"}
            // text={t('messages.removeEventSuccess')}
            showCloseButton
          />
        );
        onComplete();
      })
      .catch((err) => {
        console.log('stake error', err);
        toast.error(
          <ToastContent
            isDanger
            // headerIconName="calendar"
            title={t('titles.alert')}
            text="Error getting rewards"
            // text={t('errors.couldNotRemoveEvent')}
            showCloseButton
          />
        );
      });
  };
  const onUnstake = (address: string, amount: number) => {
    console.log('onUnstake', address);
    if (!nft) {
      console.log('nft not found');
      return;
    }

    nftStore
      .unstake(wallet, amount, nft.id)
      .then(() => {
        console.log('unstake success');
        toast.info(<ToastContent title={"You've unstaked!"} showCloseButton />);
        onComplete();
      })
      .catch((err) => {
        console.log('unstake error', err);
        toast.error(<ToastContent isDanger title="Error unstaking" showCloseButton />);
      });
  };

  return (
    <styled.Container>
      <TabBar tabs={tabBarTabs} selectedTab={activeTab} onTabSelect={() => {}} />
      <styled.TabContent>
        {activeTab.id === 'wallet' && (
          <>
            <div>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Wallet account" />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text="ACCOUNT" />
                  </styled.LabeledLineLabelContainer>
                  <Text size="xxs" text={initiatorWallet} />
                </styled.LabeledLineContainer>
                {/* <Dropdown
                  placeholder="Select account"
                  variant="third"
                  valueType="wallet"
                  options={accountOptions}
                  value={wallet}
                  onOptionSelect={(option) => {
                    setWallet(option.value);
                  }}
                /> */}
              </styled.Section>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Balance" />
                </styled.SectionHeader>
                <styled.BalanceContainer>
                  {balanceSections.map((section) => section)}
                </styled.BalanceContainer>
              </styled.Section>
              <styled.Separator />
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Active Stakes" />
                </styled.SectionHeader>
                {Array.from(stakingAtOthers.values()).map((stakingDetail) => (
                  <div key={stakingDetail.destAddr}>
                    <Text size="m" text={stakingDetail.sourceAddr} align="left" />
                    <Text size="m" text={`${stakingDetail.amount}`} align="left" />
                    <Button
                      label="Unstake"
                      onClick={() => setUnstakeFrom(stakingDetail.destAddr)}
                    />
                  </div>
                ))}
                {stakes.map((stakingDetail) => (
                  <div key={stakingDetail.user}>
                    <Text size="m" text={stakingDetail.user} align="left" />
                    <Text size="m" text={`${stakingDetail.staked}`} align="left" />
                    <Text size="m" text={`${stakingDetail.reward}`} align="left" />
                    <Button label="Unstake" onClick={() => setUnstakeFrom(stakingDetail.user)} />
                  </div>
                ))}
              </styled.Section>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Rewards" />
                </styled.SectionHeader>
                <Text size="m" text={`${accumulatedRewards}`} align="left" />
              </styled.Section>
              <styled.Buttons className="end">
                <Button label="Get Rewards" onClick={() => setGetRewards(true)} />
              </styled.Buttons>

              {/* <Heading type="h2" label="TEMP Mint NFT" />
              <Button label="TEMP Mint Nft" onClick={() => nftStore.mintNft(wallet)} /> */}
            </div>
            {/* <styled.Buttons>
              <Button label="Back" onClick={() => setActiveTab(tabBarTabs[0])} />
              <Button label="Next" onClick={() => setActiveTab(tabBarTabs[2])} />
            </styled.Buttons> */}
          </>
        )}
        {!!unstakeFromDetail && (
          <>
            <div>
              <Heading type="h2" label="Unstake your contribution" />
              <Text size="m" text="Amount" align="left" />
              <Input type="number" value={amount} onChange={(val) => setAmount(Number(val))} />
              <Text size="m" text="Unstake From" align="left" />
              <Text size="m" text={`TODO ${unstakeFrom}`} align="left" />
            </div>

            <styled.Buttons>
              <Button label="Back" onClick={() => setUnstakeFrom(null)} />
              <Button
                label="Sign & Submit"
                onClick={() => onUnstake(unstakeFromDetail.destAddr, amount)}
              />
            </styled.Buttons>
          </>
        )}
        {getRewards && (
          <>
            <div>
              <Heading type="h2" label="Get Rewards" />
              <Text size="m" text="Amount TODO" align="left" />
            </div>

            <styled.Buttons>
              <Button label="Back" onClick={() => setGetRewards(false)} />
              <Button label="Sign & Submit" onClick={() => onGetRewards()} />
            </styled.Buttons>
          </>
        )}
      </styled.TabContent>
    </styled.Container>
  );
};

export default observer(StakingDashboard);
