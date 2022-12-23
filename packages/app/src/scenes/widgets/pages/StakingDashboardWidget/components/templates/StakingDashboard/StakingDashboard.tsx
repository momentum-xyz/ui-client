import React, {FC, useState} from 'react';
import {Button, Heading, Input, TabBar, TabBarTabInterface, Text} from '@momentum-xyz/ui-kit';
import {
  formatTokenAmount,
  checkIfCanRequestAirdrop,
  getDateOfNextAllowedAirdrop
} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {t} from 'i18next';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';
import {convertToHex} from 'core/utils';

import * as styled from './StakingDashboard.styled';

const tabBarTabs: TabBarTabInterface[] = [
  {
    id: 'wallet',
    label: t('staking.walletTitle'),
    title: t('staking.walletTitle'),
    icon: 'wallet',
    disabled: true
  },
  {
    id: 'confirm',
    title: t('staking.confirmTitle'),
    label: t('staking.confirmTitle'),
    icon: 'check',
    disabled: true
  }
];

const StakingDashboard: FC = () => {
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

  const [canRequestAirdrop, setCanRequestAirdrop] = useState<boolean>(checkIfCanRequestAirdrop());
  const [nextAvailableAirdropTime, setNextAvailableAirdropTime] = useState<string>(
    getDateOfNextAllowedAirdrop()
  );

  const balanceSections = [
    {label: t('staking.balanceTypes.account'), value: balanceTotal},
    {label: t('staking.balanceTypes.transferable'), value: balanceTransferrable},
    {label: t('staking.balanceTypes.staked'), value: balanceReserved}
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
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('staking.rewardSuccessTitle')}
            text={t('staking.successGetRewards')}
            showCloseButton
          />
        );
        nftStore.stakingDashorboardDialog.close();
      })
      .catch((err) => {
        console.log('stake error', err);
        toast.error(
          <ToastContent
            headerIconName="alert"
            isDanger
            title={t('staking.rewardErrorTitle')}
            text={t('staking.error')}
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
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('staking.unStakeSuccessTitle')}
            text={t('staking.successUnstake', {
              amount: formatTokenAmount(amount, chainDecimals, tokenSymbol)
            })}
            showCloseButton
          />
        );
        nftStore.stakingDashorboardDialog.close();
      })
      .catch((err) => {
        console.log('unstake error', err);
        toast.error(
          <ToastContent
            headerIconName="alert"
            isDanger
            title={t('staking.unStakeErrorTitle')}
            text={t('staking.error')}
            showCloseButton
          />
        );
      });
  };
  const onRequestAirdrop = () => {
    console.log('requestAirdrop', wallet);

    nftStore
      .requestAirdrop(wallet)
      .then(() => {
        console.log('requestAirdrop success');
        toast.info(
          <ToastContent
            headerIconName="alert"
            title={t('staking.airdropSuccessTitle')}
            text={t('staking.requestAirdropSuccess')}
            showCloseButton
          />
        );
        setCanRequestAirdrop(checkIfCanRequestAirdrop());
        setNextAvailableAirdropTime(getDateOfNextAllowedAirdrop());
      })
      .catch((err) => {
        console.log('requestAirdrop error', err);
        setCanRequestAirdrop(checkIfCanRequestAirdrop());
        setNextAvailableAirdropTime(getDateOfNextAllowedAirdrop());
        toast.error(
          <ToastContent
            headerIconName="alert"
            isDanger
            title={t('staking.airdropErrorTitle')}
            text={t('staking.requestAirdropFailed')}
            showCloseButton
          />
        );
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
                  <Heading type="h2" align="left" label={t('staking.walletAccount')} />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text={t('staking.account')} />
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
                  <Heading type="h2" align="left" label={t('staking.balance')} />
                </styled.SectionHeader>
                <styled.BalanceContainer>
                  {balanceSections.map((section) => section)}
                </styled.BalanceContainer>
              </styled.Section>
              <styled.Separator />
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label={t('staking.activeStakes')} />
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
                        {/*TODO: format using nftStore*/}
                        <Text
                          size="s"
                          text={t('staking.stakedAmount', {
                            amount: formatTokenAmount(
                              stakingDetail.amount,
                              chainDecimals,
                              tokenSymbol
                            )
                          })}
                          align="left"
                        />

                        {/* we don't have rewards per item yet */}
                        {/* <Text
                      size="s"
                      text={`Rewarded ${formatTokenAmount(stakingDetail.amount)} ${tokenSymbol}`}
                      align="left"
                    /> */}
                        <Button
                          label={t('staking.unStake')}
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
                  <Heading type="h2" align="left" label={t('staking.rewards')} />
                </styled.SectionHeader>
                <styled.RewardData>
                  <div>
                    <Text
                      size="s"
                      align="left"
                      text={t('staking.totalRewards')}
                      className="with-padding"
                    />
                    <Text size="s" text={accountAccumulatedRewards} align="left" />
                  </div>
                  <Button
                    label={t('staking.getRewards')}
                    disabled={!canReceiveAccumulatedRewards}
                    onClick={() => setGetRewards(true)}
                  />
                </styled.RewardData>
              </styled.Section>
              <styled.Section>
                <styled.Buttons className="start">
                  <Button
                    label={t('staking.requestAirdrop')}
                    disabled={!canRequestAirdrop}
                    onClick={() => onRequestAirdrop()}
                  />
                  {!canRequestAirdrop && (
                    <Text
                      size="s"
                      text={t('staking.nextAirdropAvailableOn', {date: nextAvailableAirdropTime})}
                      align="left"
                    />
                  )}
                </styled.Buttons>
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
                  <Heading type="h2" label={t('staking.unStakeContribution')} />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    {/*{t('staking.stakingBlocks', {blocks: formatNumber(blocks)})}*/}
                    <Text
                      size="m"
                      text={t('staking.tokenAmount', {amount: tokenSymbol})}
                      align="left"
                    />
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
                  <Text size="m" text={t('staking.unStakeFrom')} align="left" />
                </styled.LabeledLineLabelContainer>
                <Text
                  size="m"
                  text={`${unstakeFromNft?.name} ${unstakeFromDetail.destAddr.substring(0, 20)}`}
                  align="left"
                />
              </styled.LabeledLineContainer>
            </div>

            <styled.Buttons>
              <Button label={t('staking.back')} onClick={() => setUnstakeFrom(null)} />
              <Button
                label={t('staking.signAndSubmit')}
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
                <Heading type="h2" align="left" label={t('staking.getRewards')} />
              </styled.SectionHeader>
              <styled.LabeledLineContainer>
                <styled.LabeledLineLabelContainer>
                  <Text size="xxs" align="right" text={t('staking.account')} />
                </styled.LabeledLineLabelContainer>
                <Text size="xxs" text={initiatorInfo} />
              </styled.LabeledLineContainer>
              <styled.LabeledLineContainer>
                <styled.LabeledLineLabelContainer>
                  <Text size="xxs" align="right" text={t('staking.amount')} />
                </styled.LabeledLineLabelContainer>
                <Text size="s" text={accountAccumulatedRewards} align="left" />
              </styled.LabeledLineContainer>
            </styled.Section>

            <styled.Buttons>
              <Button label={t('staking.back')} onClick={() => setGetRewards(false)} />
              <Button label={t('staking.signAndSubmit')} onClick={() => onGetRewards()} />
            </styled.Buttons>
          </>
        )}
      </styled.TabContent>
    </styled.Container>
  );
};

export default observer(StakingDashboard);
