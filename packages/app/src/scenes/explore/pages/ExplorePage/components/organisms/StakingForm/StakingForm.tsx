import React, {FC, useMemo, useState} from 'react';
import {Button, Heading, Input, TabBar, TabBarTabInterface, Text} from '@momentum-xyz/ui-kit';
import {formatTokenAmount} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './StakingForm.styled';

// TODO: fizlin
// - fix tab styles
// - Change authorize icon

const tabBarTabs: TabBarTabInterface[] = [
  {
    id: 'start',
    title: '1. Start Connecting',
    label: '1. Start Connecting',
    icon: 'hierarchy',
    disabled: true
  },
  {
    id: 'wallet',
    label: '2. My Wallet',
    title: '2. My Wallet',
    icon: 'wallet',
    disabled: true
  },
  {
    id: 'confirm',
    title: '3. Authorize',
    label: '3. Authorize',
    icon: 'check',
    disabled: true
  }
];

interface PropsInterface {
  nftItemId: number;
  onComplete: () => void;
}

const StakingForm: FC<PropsInterface> = ({nftItemId, onComplete}) => {
  const {authStore, nftStore} = useStore();
  const {wallet: authWallet} = authStore;
  const {balance, addresses, accountOptions, nftItems} = nftStore;

  // TODO: fizlin - replace with real data
  console.log(
    accountOptions, // get initiator wallet from here
    nftItems // get destination from here
  );
  const initiatorWallet = useMemo(() => 'EDhjohSyRxb....', []);
  const [destination, setDestination] = useState('Tyrone smith -  fPZZcgHfYVonk');

  const [wallet = addresses[0]?.address] = useState(authWallet);

  const [activeTab, setActiveTab] = useState<TabBarTabInterface>(tabBarTabs[0]);
  const [amount, setAmount] = useState(1_000_000_000);

  console.log('StakingForm', {wallet, addresses, authWallet, amount});

  const onStake = (amount: number) => {
    console.log('onStake', wallet, nftItemId);

    nftStore
      .stake(wallet, amount, nftItemId)
      .then(() => {
        console.log('stake success');
        toast.info(
          <ToastContent
            headerIconName="calendar"
            title={t('titles.alert')}
            text={t('messages.removeEventSuccess')}
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
            headerIconName="calendar"
            title={t('titles.alert')}
            text={t('errors.couldNotRemoveEvent')}
            showCloseButton
          />
        );
      });
  };

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

  return (
    <styled.Container>
      <TabBar tabs={tabBarTabs} selectedTab={activeTab} onTabSelect={(tab) => setActiveTab(tab)} />
      <styled.TabContent>
        {activeTab.id === 'start' && (
          <>
            <div>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Connect to another Odyssey" />
                </styled.SectionHeader>
                <Text
                  size="s"
                  text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes"
                  align="left"
                />
              </styled.Section>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Contributing" />
                </styled.SectionHeader>
                <Text
                  size="s"
                  text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes"
                  align="left"
                />
              </styled.Section>
            </div>
            <styled.Buttons>
              <span />
              <Button
                icon="wallet"
                label="Start Contributing"
                onClick={() => setActiveTab(tabBarTabs[1])}
              />
            </styled.Buttons>
          </>
        )}
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
                  <Heading type="h2" align="left" label="Start Contributing" />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text="SET AMOUNT, MTM" />
                  </styled.LabeledLineLabelContainer>
                  <styled.LabeledLineInputContainer>
                    <Input value={amount} onChange={(val) => setAmount(Number(val))} />
                  </styled.LabeledLineInputContainer>
                </styled.LabeledLineContainer>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text="DESTINATION" />
                  </styled.LabeledLineLabelContainer>
                  <styled.LabeledLineInputContainer>
                    {/* @dmitry-yudakov -- Should this be a dropdown? */}
                    <Input value={destination} onChange={(val) => setDestination(val)} />
                  </styled.LabeledLineInputContainer>
                </styled.LabeledLineContainer>
              </styled.Section>
            </div>
            <styled.Buttons>
              <Button label="Back" onClick={() => setActiveTab(tabBarTabs[0])} />
              <Button label="Next" onClick={() => setActiveTab(tabBarTabs[2])} />
            </styled.Buttons>
          </>
        )}
        {activeTab.id === 'confirm' && (
          <>
            <div>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Authorize your contribution" />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text="AMOUNT, MTM" />
                  </styled.LabeledLineLabelContainer>
                  <styled.LabeledLineInputContainer className="view-only">
                    <Input value={amount} onChange={(val) => setAmount(Number(val))} disabled />
                  </styled.LabeledLineInputContainer>
                </styled.LabeledLineContainer>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text="SENDING FROM" />
                  </styled.LabeledLineLabelContainer>
                  <Text size="xxs" text={initiatorWallet} />
                </styled.LabeledLineContainer>
                <styled.ConsentContainer>
                  <Text
                    size="s"
                    align="left"
                    text="This account is also the destination for the rewards you receive from your contribution."
                  />
                </styled.ConsentContainer>
              </styled.Section>
            </div>

            <styled.Buttons>
              <Button label="Back" onClick={() => setActiveTab(tabBarTabs[1])} />
              <Button label="Sign & Connect" icon="check" onClick={() => onStake(amount)} />
            </styled.Buttons>
          </>
        )}
      </styled.TabContent>
    </styled.Container>
  );
};

export default observer(StakingForm);
