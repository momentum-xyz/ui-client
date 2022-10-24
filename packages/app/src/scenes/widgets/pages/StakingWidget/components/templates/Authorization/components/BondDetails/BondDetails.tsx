import React from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {Heading, Text, Dropdown} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks/useStore';

import * as styled from './BondDetails.styled';

const BondDetails = () => {
  const {validatorsStore, polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {stakingAmount, tokenSymbol, controllerAccount, stashAccount} = polkadotProviderStore;
  const {selectedValidators, selectedValidatorsOptions} = validatorsStore;
  return (
    <>
      <Heading type="h2" align="left" weight="bold" label={t('staking.transactionCalls')} />
      <styled.Row>
        <Text text={t('staking.bondCall')} size="xs" weight="bold" transform="uppercase" />
        <styled.CurrentAddress>
          <Text text={`${stakingAmount} ${tokenSymbol}`} size="xs" align="left" />
        </styled.CurrentAddress>
      </styled.Row>
      {selectedValidators.length > 0 && (
        <styled.Row>
          <Text text={t('staking.nominateCall')} size="xs" weight="bold" transform="uppercase" />
          <styled.CurrentAddress>
            <Dropdown
              placeholder={t('staking.selectedNominees')}
              value={selectedValidatorsOptions[0].value}
              options={selectedValidatorsOptions}
              onOptionSelect={() => {}}
              variant="secondary"
            />
          </styled.CurrentAddress>
        </styled.Row>
      )}
      {stashAccount?.address !== controllerAccount?.address && (
        <styled.Row>
          <Text text={t('staking.setController')} size="xs" weight="bold" transform="uppercase" />
          <styled.CurrentAddress>
            <Text text={`${controllerAccount?.address || ''}`} size="xs" align="left" />
          </styled.CurrentAddress>
        </styled.Row>
      )}
      <Heading type="h2" align="left" weight="bold" label={t('staking.sendingFrom')} />
      <styled.Row>
        <Text text={stashAccount?.meta?.name || ''} size="xs" weight="bold" transform="uppercase" />
        <styled.CurrentAddress>
          <Text text={stashAccount?.address || ''} size="xs" align="left" />
        </styled.CurrentAddress>
      </styled.Row>
    </>
  );
};

export default observer(BondDetails);
