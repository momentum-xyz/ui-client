import {FC, useEffect, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel} from '@momentum-xyz/ui-kit-storybook';
import {useWeb3React} from '@web3-react/core';
import Web3 from 'web3';
import {Button} from '@momentum-xyz/ui-kit';

import abi from '../../../../staking_abi.json';

const contractAddress = '0x02e81060B6a7F688b3d09d57f5748636b901ade9';

// const abi: any[] = [
//   {
//     inputs: [
//       {
//         internalType: 'uint256',
//         name: 'num',
//         type: 'uint256'
//       }
//     ],
//     name: 'store',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function'
//   },
//   {
//     inputs: [],
//     name: 'retrieve',
//     outputs: [
//       {
//         internalType: 'uint256',
//         name: '',
//         type: 'uint256'
//       }
//     ],
//     stateMutability: 'view',
//     type: 'function'
//   }
// ];

const StakingOverviewWidget: FC = () => {
  const {library, account, activate, active} = useWeb3React();
  console.log('StakingOverviewWidget', {library, account, activate, active});

  const web3 = useMemo(() => new Web3(library.provider), [library]);

  useEffect(() => {
    if (!account) {
      return;
    }
    const getBalance = async () => {
      console.log('StakingOverviewWidget getBalance');
      const balance = await web3.eth.getBalance(account);
      console.log('StakingOverviewWidget balance', balance);
    };
    getBalance();
  }, [web3, account]);

  const contract = new web3.eth.Contract(abi as any, contractAddress);

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
      <Panel variant="primary" title="Staking Overview" icon="stake">
        <Button label="Store" onClick={store} />
        <Button label="Retrieve" onClick={retrieve} />
        <Button label="Stake" onClick={stake} />
      </Panel>
    </div>
  );
};

export default observer(StakingOverviewWidget);
