import React from 'react';
import {observer} from 'mobx-react-lite';


import {useStore} from 'shared/hooks';
import {SCANNER_LIST} from 'core/constants';

import {ScannerItem} from '../ScannerItem/ScannerItem';

import * as styled from './ScannerList.styled';

export const ScannerList = () => {
  const {widgetStore} = useStore();
  const {stakingStore} = widgetStore;
  const {stashAccount} = stakingStore.polkadotProviderStore;

  return (
    <styled.ScannerList>
      {SCANNER_LIST.map((scanner) => (
        <ScannerItem
          key={scanner.name}
          url={`${scanner.url}${stashAccount?.address || ''}`}
          name={scanner.name}
          type={scanner.type}
        />
      ))}
    </styled.ScannerList>
  );
};

export default observer(ScannerList);
