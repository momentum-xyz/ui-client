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

import * as styled from './StakingForm.styled';

const tabBarTabs: TabBarTabInterface[] = [
  {
    id: 'start',
    title: 'Start Connecting',
    label: 'Start Connecting',
    icon: 'hierarchy',
    disabled: true
  },
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
  onStake: (amount: number) => void;
}

const StakingForm: FC<PropsInterface> = ({onStake}) => {
  const [amount, setAmount] = useState(1_000_000_000);
  const [activeTab, setActiveTab] = useState<TabBarTabInterface>(tabBarTabs[0]);

  return (
    <styled.Container>
      <TabBar tabs={tabBarTabs} selectedTab={activeTab} onTabSelect={(tab) => setActiveTab(tab)} />
      <styled.TabContent>
        {activeTab.id === 'start' && (
          <>
            <div>
              <Heading type="h2" label="Connect to another Odyssey" />
              <Text
                size="m"
                text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes"
                align="left"
              />
              <Heading type="h2" label="Contributing" />
              <Text
                size="m"
                text="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes"
                align="left"
              />
            </div>
            <styled.Buttons>
              <span />
              <Button label="Start Contributing" onClick={() => setActiveTab(tabBarTabs[1])} />
            </styled.Buttons>
          </>
        )}
        {activeTab.id === 'wallet' && (
          <>
            <div>
              <Heading type="h2" label="Wallet account" />
              <Dropdown
                placeholder="Select account"
                variant="third"
                valueType="wallet"
                options={[]} // TODO
                onOptionSelect={(option) => {
                  // onSelectAddress(option.value)
                }}
              />
              <Heading type="h2" label="Balance" />
              <Text size="m" text="TODO" align="left" />
              <Heading type="h2" label="start Contributing" />
              <Input value={amount} onChange={(val) => setAmount(Number(val))} />
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
              <Heading type="h2" label="Authorize your contribution" />
              <Text size="m" text="TODO" align="left" />
              <Text size="m" text={`Amount: ${amount}`} align="left" />
            </div>

            <styled.Buttons>
              <Button label="Back" onClick={() => setActiveTab(tabBarTabs[1])} />
              <Button label="Sign & Connect" onClick={() => onStake(amount)} />
            </styled.Buttons>
          </>
        )}
      </styled.TabContent>
    </styled.Container>
  );
};

export default StakingForm;
