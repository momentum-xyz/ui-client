import React, {FC, useState} from 'react';
import {
  Button,
  Dropdown,
  Heading,
  Input,
  TabBar,
  TabBarTabInterface,
  Text
} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import {t} from 'i18next';

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
  const {wallet: authWallet, accounts} = authStore;
  // TODO load staking info for all accounts
  const {stakingAtOthers, balance, accumulatedRewards, accountOptions} = nftStore;

  const [wallet = accounts[0]?.address, setWallet] = useState(authWallet);
  const nft = wallet ? nftStore.getNftByWallet(wallet) : null;

  const [getRewards, setGetRewards] = useState(false);

  const [unstakeFrom, setUnstakeFrom] = useState<string | null>(null);
  const unstakeFromDetail = unstakeFrom ? stakingAtOthers.get(unstakeFrom) : null;
  const [_amount, setAmount] = useState<number | null>(null);
  const amount = _amount || unstakeFromDetail?.amount || 0;

  const activeTab = getRewards || !!unstakeFrom ? tabBarTabs[1] : tabBarTabs[0];

  console.log('StakingForm', {wallet, accounts, authWallet, amount});

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
              <Heading type="h2" label="Wallet account" />
              <Dropdown
                placeholder="Select account"
                variant="third"
                valueType="wallet"
                options={accountOptions}
                value={wallet}
                onOptionSelect={(option) => {
                  setWallet(option.value);
                }}
              />
              <Heading type="h2" label="Balance" />
              <Text size="m" text={JSON.stringify(balance)} align="left" />
              <Heading type="h2" label="Active Stakes" />
              {Array.from(stakingAtOthers.values()).map((stakingDetail) => (
                <div key={stakingDetail.destAddr}>
                  <Text size="m" text={stakingDetail.sourceAddr} align="left" />
                  <Text size="m" text={`${stakingDetail.amount}`} align="left" />
                  <Button label="Unstake" onClick={() => setUnstakeFrom(stakingDetail.destAddr)} />
                </div>
              ))}

              <Heading type="h2" label="Rewards" />
              <Text size="m" text={`${accumulatedRewards}`} align="left" />
              <Button label="Get Rewards" onClick={() => setGetRewards(true)} />

              <Heading type="h2" label="TEMP Mint NFT" />
              <Button label="TEMP Mint Nft" onClick={() => nftStore.mintNft(wallet)} />
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
