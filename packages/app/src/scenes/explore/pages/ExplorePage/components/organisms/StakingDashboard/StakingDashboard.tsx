import React, {FC, useState} from 'react';
import {Button, Heading, Input, TabBar, TabBarTabInterface, Text} from '@momentum-xyz/ui-kit';
import {formatTokenAmount} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import {convertToHex} from '../StakingForm/StakingForm';

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
  const {authStore, nftStore, exploreStore} = useStore();
  const {wallet: authWallet} = authStore;
  const {addresses, accountOptions} = nftStore;
  const {
    stakingAtOthers,
    balanceTotal,
    balanceReserved,
    balanceTransferrable,
    accountAccumulatedRewards,
    canReceiveAccumulatedRewards,
    chainDecimals,
    tokenSymbol
  } = nftStore;

  const [wallet = addresses[0]?.address] = useState(authWallet);
  // const nft = wallet ? nftStore.getNftByWallet(wallet) : null;

  const initiatorAccount = accountOptions.find((account) => account.value === wallet);
  const initiatorInfo = initiatorAccount
    ? `${initiatorAccount.label} (${initiatorAccount.value.substring(0, 20)}...)`
    : '';

  const [getRewards, setGetRewards] = useState(false);

  const [unstakeFrom, setUnstakeFrom] = useState<string | null>(null);
  const unstakeFromDetail = unstakeFrom ? stakingAtOthers.get(unstakeFrom) : null;
  const unstakeFromNft = unstakeFrom ? nftStore.getNftByWallet(unstakeFrom) : null;

  const [_amount, setAmount] = useState<number | null>(null);
  const amount = _amount || unstakeFromDetail?.amount || 0;
  const amountToken = amount / Math.pow(10, chainDecimals || 12);

  const balanceSections = [
    {label: 'Account Balance', value: balanceTotal},
    {label: 'Transferable', value: balanceTransferrable},
    {label: 'Staked', value: balanceReserved}
    // {label: 'Unbonding', value: null}
  ].map(({label, value}) => (
    <styled.BalanceEntityContainer key={label}>
      <Heading type="h4" align="left" label={label} />
      <Text size="xxs" align="left" text={value}></Text>
    </styled.BalanceEntityContainer>
  ));

  const activeTab = getRewards || !!unstakeFrom ? tabBarTabs[1] : tabBarTabs[0];

  console.log('StakingForm', {wallet, addresses, authWallet, amount, amountToken});

  const onGetRewards = () => {
    console.log('getRewards', wallet);

    nftStore
      .getRewards(wallet)
      .then(() => {
        console.log('getRewards success');
        toast.info(<ToastContent title={"You've got rewards!"} showCloseButton />);
        onComplete();
      })
      .catch((err) => {
        console.log('stake error', err);
        toast.error(
          <ToastContent
            isDanger
            title={t('titles.alert')}
            text="Error getting rewards"
            showCloseButton
          />
        );
      });
  };
  const onUnstake = async (address: string, amount: number) => {
    console.log('onUnstake', address, amount);
    if (!unstakeFromNft) {
      console.log('nft not found');
      throw new Error('NFT not found');
    }

    return nftStore
      .unstake(wallet, amount, unstakeFromNft.id)
      .then(() => {
        const walletAHex = convertToHex(wallet);
        const walletBHex = convertToHex(unstakeFromNft?.owner);
        console.log({walletAHex, walletBHex});

        return exploreStore.destroyMutualDocks(walletAHex, walletBHex);
      })
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
                  <Text size="xxs" text={initiatorInfo} />
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
                <styled.StakingSection>
                  {Array.from(stakingAtOthers.values()).map((stakingDetail) => {
                    const nft = nftStore.getNftByWallet(stakingDetail.destAddr);
                    return (
                      <styled.ActiveStakesLineContainer key={stakingDetail.destAddr}>
                        <Text
                          size="s"
                          text={nft?.name || stakingDetail.sourceAddr.substring(0, 20)}
                          align="left"
                          className="name"
                        />
                        <Text
                          size="s"
                          text={`Staked ${formatTokenAmount(
                            stakingDetail.amount,
                            chainDecimals,
                            tokenSymbol
                          )}`}
                          align="left"
                        />

                        {/* we don't have rewards per item yet */}
                        {/* <Text
                      size="s"
                      text={`Rewarded ${formatTokenAmount(stakingDetail.amount)} ${tokenSymbol}`}
                      align="left"
                    /> */}
                        <Button
                          label="Unstake"
                          transform="capitalized"
                          icon="chevron"
                          onClick={() => setUnstakeFrom(stakingDetail.destAddr)}
                        />
                      </styled.ActiveStakesLineContainer>
                    );
                  })}
                </styled.StakingSection>
              </styled.Section>
              <styled.Separator />
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label="Rewards" />
                </styled.SectionHeader>
                <styled.RewardData>
                  <div>
                    <Text size="s" align="left" text="Total rewards" className="with-padding" />
                    <Text size="s" text={accountAccumulatedRewards} align="left" />
                  </div>
                  <Button
                    label="Get Rewards"
                    disabled={!canReceiveAccumulatedRewards}
                    onClick={() => setGetRewards(true)}
                  />
                </styled.RewardData>
              </styled.Section>
              <styled.Separator />
            </div>
          </>
        )}
        {!!unstakeFromDetail && (
          <>
            <div>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" label="Unstake your contribution" />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="m" text={`Amount, ${tokenSymbol}`} align="left" />
                  </styled.LabeledLineLabelContainer>
                  <styled.LabeledLineInputContainer className="view-only">
                    <Input
                      type="number"
                      value={amountToken || ''}
                      disabled // TEMP fix comfortable working with decimals
                      onChange={(val) => setAmount(Number(val) * Math.pow(10, chainDecimals || 12))}
                    />
                  </styled.LabeledLineInputContainer>
                </styled.LabeledLineContainer>
              </styled.Section>
              <styled.LabeledLineContainer>
                <styled.LabeledLineLabelContainer>
                  <Text size="m" text="Unstake From" align="left" />
                </styled.LabeledLineLabelContainer>
                <Text
                  size="m"
                  text={`${unstakeFromNft?.name} ${unstakeFromDetail.destAddr.substring(0, 20)}`}
                  align="left"
                />
              </styled.LabeledLineContainer>
            </div>

            <styled.Buttons>
              <Button label="Back" onClick={() => setUnstakeFrom(null)} />
              <Button
                label="Sign & Submit"
                onClick={() =>
                  onUnstake(unstakeFromDetail.destAddr, amount).then(() => {
                    setAmount(null);
                  })
                }
              />
            </styled.Buttons>
          </>
        )}
        {getRewards && (
          <>
            <styled.Section>
              <styled.SectionHeader>
                <Heading type="h2" align="left" label="Get Rewards" />
              </styled.SectionHeader>
              <styled.LabeledLineContainer>
                <styled.LabeledLineLabelContainer>
                  <Text size="xxs" align="right" text="ACCOUNT" />
                </styled.LabeledLineLabelContainer>
                <Text size="xxs" text={initiatorInfo} />
              </styled.LabeledLineContainer>
              <styled.LabeledLineContainer>
                <styled.LabeledLineLabelContainer>
                  <Text size="xxs" align="right" text="AMOUNT" />
                </styled.LabeledLineLabelContainer>
                <Text size="s" text={accountAccumulatedRewards} align="left" />
              </styled.LabeledLineContainer>
            </styled.Section>

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
