import React, {FC, useState} from 'react';
import {Heading, Input, TabBar, TabBarTabInterface, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import BN from 'bn.js';
import {useI18n} from '@momentum-xyz/core';
import {Button, Select} from '@momentum-xyz/ui-kit-storybook';

import {useBlockchain, useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';
// import {WalletModelInterface} from 'core/models';
// import {getWalletByAddress} from 'wallets';
// import {convertToHex} from 'core/utils';
//import {NewsfeedTypeEnum} from 'core/enums';

import * as styled from './StakingForm.styled';

const DEFAULT_STAKING_AMOUNT = 1;
// const ODYSSEY_GET_STARTED_WALLET = 'https://discover.odyssey.org/create-your-odyssey/get-a-wallet';

interface PropsInterface {
  isGuest?: boolean;
  nftItemId: number | string;
  onComplete: () => void;
}

const StakingForm: FC<PropsInterface> = ({isGuest, nftItemId, onComplete}) => {
  const {nftStore} = useStore();
  const {
    // wallets,
    walletOptions,
    selectedWalletId: wallet,
    setSelectedWalletId,
    // balanceTotal,
    // balanceReserved,
    balanceTransferrable,
    canBeStaked,
    addresses,
    // accountOptions,
    nftItems,
    chainDecimals,
    tokenSymbol
  } = nftStore;

  const {t} = useI18n();

  // const [selectedWallet = wallets[0], setSelectedWallet] = useState<WalletModelInterface>();

  // const [wallet = addresses[0]?.address] = useState(authWallet);
  // const initiatorAccount = accountOptions.find((account) => account.value === wallet);
  // const initiatorInfo = initiatorAccount
  //   ? `${initiatorAccount.label} (${initiatorAccount.value.substring(0, 20)}...)`
  //   : '';

  const tabBarTabs: TabBarTabInterface[] = [
    {
      id: 'start',
      title: t('staking.startLabel'),
      label: t('staking.startLabel'),
      icon: 'hierarchy',
      disabled: true
    },
    {
      id: 'wallet',
      label: t('staking.walletLabel'),
      title: t('staking.walletLabel'),
      icon: 'wallet',
      disabled: true
    },
    {
      id: 'confirm',
      title: t('staking.confirmLabel'),
      label: t('staking.confirmLabel'),
      icon: 'check',
      disabled: true
    }
  ];

  const [activeTab, setActiveTab] = useState<TabBarTabInterface>(tabBarTabs[1]);
  const [amountString, setAmountString] = useState(DEFAULT_STAKING_AMOUNT.toString());
  const amountStringValueCheckRegex = /^\d{1,12}((\.|,)\d{0,4})?$/;

  // this allows us to use decimals while also validating with BN
  const amountAtoms = new BN(+amountString * 1_000).mul(new BN(Math.pow(10, chainDecimals - 3)));

  const nft = nftItems.find((nft) => nft.uuid === nftItemId);
  // const myNft = nftItems.find((nft) => nft.owner === wallet);
  console.log('StakingForm', {nft, nftItemId, nftItems});

  console.log('StakingForm', {wallet, addresses, amountString, amountAtoms, nft});
  // console.log('initiatorAccount', initiatorAccount, nft);

  const {isBlockchainReady, walletSelectContent, account, stake} = useBlockchain({
    requiredAccountAddress: wallet
  });
  // TODO make sure account === selectedAccount

  console.log('StakeForm useStaking', {isBlockchainReady, account, stake});

  const onStake = async (amountAtoms: BN) => {
    try {
      console.log('onStake', wallet, nftItemId, amountAtoms);
      // await nftStore.stake(wallet, amountAtoms, nftItemId);
      await stake(nftItemId as string, amountAtoms);
      console.log('stake success');

      toast.info(
        <ToastContent
          headerIconName="alert"
          title={t('staking.stakeSuccessTitle')}
          text={t('staking.stakeSuccess', {
            amount: amountString,
            name: nft?.name
          })}
          showCloseButton
        />
      );
      // }
    } catch (err) {
      console.log('stake error', err);
      toast.error(
        <ToastContent
          headerIconName="alert"
          isDanger
          title={t('staking.stakeErrorTitle')}
          text={t('staking.error')}
          showCloseButton
        />
      );
    } finally {
      onComplete();
    }
  };

  const onStakeAmountInput = (val: string) => {
    if (!validStringCheck(val)) {
      return;
    }
    setAmountString(val);
  };

  const balanceSections = [
    // {label: t('staking.balanceTypes.account'), value: balanceTotal},
    {label: t('staking.balanceTypes.transferable'), value: balanceTransferrable}
    // {label: t('staking.balanceTypes.staked'), value: balanceReserved}
    // {label: 'Unbonding', value: null}
  ].map(({label, value}) => (
    <styled.BalanceEntityContainer key={label}>
      <Heading type="h4" align="left" label={label} />
      <Text size="xxs" align="left" text={value}></Text>
    </styled.BalanceEntityContainer>
  ));

  const isBalanceTooLow = !canBeStaked(amountAtoms);

  // const isStakingInSelf = nft === myNft;
  const validStringCheck = (val: string): boolean => !val || amountStringValueCheckRegex.test(val);

  // TEMP disable
  // if (!nft) {
  //   console.log('StakingForm - no nft found');
  //   return null;
  // }

  return (
    <styled.Container>
      <TabBar tabs={tabBarTabs} selectedTab={activeTab} onTabSelect={(tab) => setActiveTab(tab)} />
      <styled.TabContent>
        {activeTab.id === 'wallet' && (
          <>
            <div>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label={t('staking.walletAccount')} />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.Filters>
                    <div>{t('labels.account')}</div>
                    <Select
                      wide
                      options={walletOptions}
                      value={wallet}
                      placeholder={t('actions.selectWallet')}
                      onSingleChange={setSelectedWalletId}
                    />
                  </styled.Filters>
                  {/* <Text size="xxs" text={initiatorInfo} /> */}
                </styled.LabeledLineContainer>
                {walletSelectContent}
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
                  <Heading type="h2" align="left" label={t('staking.startContributing')} />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text
                      size="xxs"
                      align="right"
                      text={t('staking.setAmountSymbol', {symbol: tokenSymbol})}
                    />
                  </styled.LabeledLineLabelContainer>
                  <styled.LabeledLineInputContainer>
                    <Input autoFocus value={amountString || ''} onChange={onStakeAmountInput} />
                  </styled.LabeledLineInputContainer>
                </styled.LabeledLineContainer>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text={t('staking.destination')} />
                  </styled.LabeledLineLabelContainer>
                  {/* <Text size="xxs" text={`${nft.name} ${nft.owner.substring(0, 20)}...`} /> */}
                </styled.LabeledLineContainer>
              </styled.Section>
            </div>
            <styled.Buttons>
              {/* <Button label={t('staking.back')} onClick={() => setActiveTab(tabBarTabs[0])} /> */}
              <Button
                label={t('staking.next')}
                onClick={() => setActiveTab(tabBarTabs[2])}
                disabled={
                  !amountString || isBalanceTooLow || !isBlockchainReady
                  // || isStakingInSelf
                }
              />
            </styled.Buttons>
          </>
        )}
        {activeTab.id === 'confirm' && (
          <>
            <div>
              <styled.Section>
                <styled.SectionHeader>
                  <Heading type="h2" align="left" label={t('staking.authorizeContribution')} />
                </styled.SectionHeader>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text
                      size="xxs"
                      align="right"
                      text={t('staking.tokenAmount', {amount: tokenSymbol})}
                    />
                  </styled.LabeledLineLabelContainer>
                  <styled.LabeledLineInputContainer className="view-only">
                    <Input value={amountString} onChange={onStakeAmountInput} disabled />
                  </styled.LabeledLineInputContainer>
                </styled.LabeledLineContainer>
                <styled.LabeledLineContainer>
                  <styled.LabeledLineLabelContainer>
                    <Text size="xxs" align="right" text={t('staking.sendingFrom')} />
                  </styled.LabeledLineLabelContainer>
                  {/* <Text size="xxs" text={initiatorInfo} /> */}
                </styled.LabeledLineContainer>
                <styled.ConsentContainer>
                  <Text size="s" align="left" text={t('staking.contributionMessage')} />
                </styled.ConsentContainer>
              </styled.Section>
            </div>

            <styled.Buttons>
              <Button label={t('staking.back')} onClick={() => setActiveTab(tabBarTabs[1])} />
              <Button
                label={t('staking.signAndConnect')}
                icon="check"
                onClick={() => onStake(amountAtoms)}
              />
            </styled.Buttons>
          </>
        )}
      </styled.TabContent>
    </styled.Container>
  );
};

export default observer(StakingForm);
