import React, {FC} from 'react';
import {t} from 'i18next';
import {formatBalance, formatNumber} from '@polkadot/util';
import {observer} from 'mobx-react-lite';
import {PropsWithThemeInterface} from '@momentum/ui-kit';
import {IconSvg, Text, Tooltip} from 'ui-kit';
import {useStore} from 'shared/hooks';

import {BlockTime} from '../BlockTime';

import * as styled from './UnbondingIndicator.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const UnbondingIndicator: FC<PropsInterface> = ({theme}) => {
  const {polkadotProviderStore} = useStore().widgetStore.stakingStore;
  const {channel, stashStakingBalance, tokenSymbol, unlockingProgress} = polkadotProviderStore;
  const [mapped] = unlockingProgress;
  return (
    <Tooltip
      label={mapped.map(
        ([{value}, eras, blocks], index): React.ReactNode => (
          <div key={index}>
            <div>
              {`${t('staking.balanceTypes.unbonding')} ${formatBalance(value, {forceUnit: '-'})}`}
            </div>
            {channel?.consts.babe?.epochDuration ? (
              <BlockTime blocks={blocks} />
            ) : (
              t('staking.erasRemaining', {eras: formatNumber(eras)})
            )}
          </div>
        )
      )}
      placement="top"
      darkBackground
      size={{width: '240px'}}
    >
      <styled.UnbondingIndicator>
        <IconSvg name="clock" theme={theme} size="large" />
        <Text
          text={`${t('staking.balanceTypes.unbonding')} ${
            stashStakingBalance.unbonding
          } ${tokenSymbol}`}
          size="xs"
        />
      </styled.UnbondingIndicator>
    </Tooltip>
  );
};

export default observer(UnbondingIndicator);
