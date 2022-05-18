import React, {FC} from 'react';
import {t} from 'i18next';
import {formatBalance, formatNumber} from '@polkadot/util';
import {observer} from 'mobx-react-lite';

import {IconSvg, PropsWithThemeInterface, Tooltip} from 'ui-kit';
import {useStore} from 'shared/hooks';
import SubstrateProvider from 'shared/services/web3/SubstrateProvider';

import {BlockTime} from '../BlockTime';

import * as styled from './UnbondingIndicator.styled';

interface PropsInterface extends PropsWithThemeInterface {}

const UnbondingIndicator: FC<PropsInterface> = ({theme}) => {
  const {widgetStore} = useStore();
  const {stakingInfo, sessionProgress, channel} = widgetStore.stakingStore.polkadotProviderStore;
  const [mapped] = SubstrateProvider.deriveUnbondingProgress(stakingInfo, sessionProgress);
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
      size={{width: '200px'}}
    >
      <styled.UnbondingIndicator>
        <IconSvg name="clock" theme={theme} size="large" />
      </styled.UnbondingIndicator>
    </Tooltip>
  );
};

export default observer(UnbondingIndicator);
