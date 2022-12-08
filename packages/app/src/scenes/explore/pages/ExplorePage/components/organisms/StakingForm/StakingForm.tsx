import React, {FC, useMemo, useState} from 'react';
import {Button, Heading, Input, TabBar, TabBarTabInterface, Text} from '@momentum-xyz/ui-kit';
import {formatTokenAmount} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {decodeAddress} from '@polkadot/util-crypto';
import {u8aToHex} from '@polkadot/util';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './StakingForm.styled';

const DEFAULT_STAKING_AMOUNT = 1;

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
const convertToHex = (address: string) => {
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);
  return hexPublicKey;
};

const StakingForm: FC<PropsInterface> = ({nftItemId, onComplete}) => {
  const {authStore, nftStore, exploreStore} = useStore();
  const {wallet: authWallet} = authStore;
  const {balance, addresses, accountOptions, nftItems, chainDecimals, tokenSymbol} = nftStore;

  const [wallet = addresses[0]?.address] = useState(authWallet);
  const initiatorAccount = accountOptions.find((account) => account.value === wallet);
  const initiatorInfo = initiatorAccount
    ? `${initiatorAccount.label} (${initiatorAccount.value.substring(0, 20)}...)`
    : '';

  const [activeTab, setActiveTab] = useState<TabBarTabInterface>(tabBarTabs[0]);
  const [amount, setAmount] = useState(DEFAULT_STAKING_AMOUNT);
  const amountAtoms = amount * Math.pow(10, chainDecimals || 12);

  const nft = nftItems.find((nft) => nft.id === nftItemId);
  const myNft = nftItems.find((nft) => nft.owner === wallet);
  console.log('StakingForm', {wallet, addresses, authWallet, amount, amountAtoms, nft});

  console.log('initiatorAccount', initiatorAccount, nft);

  const onStake = (amountAtoms: number) => {
    console.log('onStake', wallet, nftItemId, amountAtoms);

    nftStore
      .stake(wallet, amountAtoms, nftItemId)
      .then(() => {
        console.log('stake success');

        if (myNft && nft) {
          exploreStore.createNewsFeedItem({
            ...myNft,
            type: 'connected',
            date: new Date().toISOString(),
            connectedTo: {
              ...nft,
              type: 'connected',
              date: new Date().toISOString()
            }
          });

          if (nft && nftStore.mutualStakingAddresses.includes(nft.owner)) {
            console.log('MUTUAL STAKING');
            const walletAHex = convertToHex(wallet);
            const walletBHex = convertToHex(nft?.owner);
            console.log({walletAHex, walletBHex});
            exploreStore.createMutualDocks(walletAHex, walletBHex);
          } else {
            console.log('No mutual staking');
          }
        }
      })
      .then(() => {
        toast.info(<ToastContent title="You successfully staked!" showCloseButton />);
        onComplete();
      })
      .catch((err) => {
        console.log('stake error', err);
        toast.error(
          <ToastContent isDanger title="Could not stake. Please try again later." showCloseButton />
        );
      });
  };

  const balanceSections = useMemo(() => {
    const balanceEntities = [
      {label: 'Account Balance', value: Number(balance.free)},
      {label: 'Transferable', value: Number(balance.free) - Number(balance.reserved)},
      {label: 'Stacked', value: Number(balance.reserved)}
      // {label: 'Unbonding', value: null}
    ];

    return balanceEntities.map(({label, value}) => {
      const balanceValueText =
        value !== null ? formatTokenAmount(value, chainDecimals, tokenSymbol) : '-';
      return (
        <styled.BalanceEntityContainer key={label}>
          <Heading type="h4" align="left" label={label} />
          <Text size="xxs" align="left" text={balanceValueText}></Text>
        </styled.BalanceEntityContainer>
      );
    });
  }, [balance]);

  if (!nft) {
    console.log('StakingForm - no nft found');
    return null;
  }

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
                  <Text size="xxs" text={initiatorInfo} />
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
                    <Input value={amount || ''} onChange={(val) => setAmount(Number(val))} />
                  </styled.LabeledLineInputContainer>
                </styled.LabeledLineContainer>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text="DESTINATION" />
                  </styled.LabeledLineLabelContainer>
                  <Text size="xxs" text={`${nft.name} ${nft.owner.substring(0, 20)}...`} />
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
                  <Text size="xxs" text={initiatorInfo} />
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
              <Button label="Sign & Connect" icon="check" onClick={() => onStake(amountAtoms)} />
            </styled.Buttons>
          </>
        )}
      </styled.TabContent>
    </styled.Container>
  );
};

export default observer(StakingForm);
