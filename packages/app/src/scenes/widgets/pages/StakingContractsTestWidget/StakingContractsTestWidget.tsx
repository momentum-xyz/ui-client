import {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';
import {Button} from '@momentum-xyz/ui-kit';

import abi from '../../../../staking_abi.json';
import {SignIn} from '../LoginWidget/components';

// const contractAddress = '0x02e81060B6a7F688b3d09d57f5748636b901ade9';
const contractAddress = '0xB51b7639e37150C8924d1Ee35bd3f338C8C9F89c';

const L2_MOM = '0x37946707DB48F3812D465da4f3D8163B273981B5';
const L1_MOM = '0xe1080224B632A93951A7CFA33EeEa9Fd81558b5e';
const L2_DAD = '0x7F85fB7f42A0c0D40431cc0f7DFDf88be6495e67';
const L2_STAKING = '0x7b650845242a96595f3a9766D4e8e5ab0887936A';

const StakingContractsTestWidget: FC = () => {
  const {library, account, activate, active} = useWeb3React();
  console.log('StakingOverviewWidget', {library, account, activate, active});

  const web3 = useMemo(() => (library ? new Web3(library.provider) : null), [library]);

  return (
    <div>
      <Panel variant="primary" title="Staking TEST" icon="stake">
        {!library && (
          <SignIn
            onConnected={() => {
              console.log('Wallet connected');
            }}
          />
        )}
        {web3 && account && <StakingInner web3={web3} account={account} />}
      </Panel>
    </div>
  );
};

const StakingInner: FC<{web3: Web3; account: string}> = ({web3, account}) => {
  const contract = useMemo(() => new web3.eth.Contract(abi as any, contractAddress), [web3]);

  useEffect(() => {
    if (!account) {
      return;
    }

    contract
      .getPastEvents('Stake', {
        // filter: {
        //     value: ['1000', '1337']    //Only get events where transfer value was 1000 or 1337
        // },
        fromBlock: 0, //Number || "earliest" || "pending" || "latest"
        toBlock: 'latest'
      })
      .then((results) => console.log('StakingOverviewWidget event', results))
      .catch((err) => console.log(err));

    contract.events
      .Stake({
        // fromBlock: 0,
        // toBlock: 'latest'
      })
      .on('data', (event: any) => console.log('StakingOverviewWidget data', event))
      .on('changed', (changed: any) => console.log('StakingOverviewWidget changed', changed))
      .on('error', (err: any) => {
        console.log('StakingOverviewWidget error', err);
        throw err;
      })
      .on('connected', (nr: any) => console.log('StakingOverviewWidget connected', nr));

    const options = {
      fromBlock: 33,
      address: [account, contractAddress, L2_MOM, L1_MOM, L2_DAD, L2_STAKING] //Only get events from specific addresses
      // topics: [] //What topics to subscribe to
    };
    const subscription = web3.eth.subscribe('logs', options, (err, event) => {
      if (!err) {
        console.log(event);
      }
    });

    subscription.on('data', (event) => console.log('StakingOverviewWidget data', event));
    subscription.on('changed', (changed) => console.log('StakingOverviewWidget changed', changed));
    subscription.on('error', (err) => {
      console.log('StakingOverviewWidget error', err);
      throw err;
    });
    subscription.on('connected', (nr) => console.log('StakingOverviewWidget connected', nr));

    const getBalance = async () => {
      console.log('StakingOverviewWidget getBalance');
      const balance = await web3.eth.getBalance(account);
      console.log('StakingOverviewWidget balance', balance);
    };
    getBalance();
  }, [web3, account, contract]);

  const store = async () => {
    console.log('StakingOverviewWidget store');
    const result = await contract.methods.store(42).send({from: account});
    console.log('StakingOverviewWidget store result', result);
  };

  const retrieve = async () => {
    console.log('StakingOverviewWidget retrieve');
    const result = await contract.methods.retrieve().call();
    console.log('StakingOverviewWidget retrieve result', result);
  };

  const stake = async () => {
    console.log('StakingOverviewWidget stake');
    const result = await contract.methods
      .stake('0x98e3a28d007d404bb370902d38032027', 1_000_000_042, 0)
      .send({from: account});
    console.log('StakingOverviewWidget stake result', result);
  };

  return (
    <div>
      <Button label="Store" onClick={store} />
      <Button label="Retrieve" onClick={retrieve} />
      <Button label="Stake" onClick={stake} />
    </div>
  );
};

export default observer(StakingContractsTestWidget);
