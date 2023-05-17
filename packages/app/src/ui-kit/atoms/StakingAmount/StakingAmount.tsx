import {FC, memo} from 'react';
import {useI18n} from '@momentum-xyz/core';
import {IconSvg, SymbolAmount} from '@momentum-xyz/ui-kit';

import {formatBigInt} from 'core/utils';

import * as styled from './StakingAmount.styled';

interface PropsInterface {
  stakedAmount: string;
  tokenSymbol: string;
}

const StakingAmount: FC<PropsInterface> = ({stakedAmount, tokenSymbol}) => {
  const {t} = useI18n();

  return (
    <styled.Container data-testid="StakingAmount-test">
      <styled.TitleContainer>
        <styled.Title>
          <IconSvg name="stake" size="xs" isWhite />
          <span>{t('labels.staked')}</span>
        </styled.Title>
      </styled.TitleContainer>

      <styled.TotalAmount>
        <div>{t('labels.totalAmountStaked')}:</div>
        <SymbolAmount stringValue={formatBigInt(stakedAmount)} tokenSymbol={tokenSymbol} />
      </styled.TotalAmount>
    </styled.Container>
  );
};

export default memo(StakingAmount);
