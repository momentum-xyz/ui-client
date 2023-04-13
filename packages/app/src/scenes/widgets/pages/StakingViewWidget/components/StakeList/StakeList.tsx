import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Input,
  Frame,
  stringInputMask,
  Select,
  StakeCard,
  ImageSizeEnum,
  SelectOptionInterface
} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {StakeSortType} from 'core/types';
import {
  FilterFieldModelType,
  SearchQueryModelModelType,
  SortFieldModelType,
  StakeModelInterface
} from 'core/models';

import * as styled from './StakeList.styled';

interface PropsInterface {
  searchQuery: SearchQueryModelModelType;
  stakeList: StakeModelInterface[];
  filterField: FilterFieldModelType;
  filterOptions: SelectOptionInterface<string>[];
  sortField: SortFieldModelType;
  sortOptions: SelectOptionInterface<StakeSortType>[];
  onSelectStake: (uuid: string) => void;
  onUnstake: (uuid: string) => void;
  onStake: (worldId: string) => void;
}

const StakeList: FC<PropsInterface> = ({
  searchQuery,
  stakeList,
  filterField,
  filterOptions,
  sortField,
  sortOptions,
  onSelectStake,
  onUnstake,
  onStake
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="StakeList-test">
      <Frame>
        <styled.Search>
          <Input
            isSearch
            value={searchQuery.query}
            placeholder={t('actions.searchStakes')}
            opts={stringInputMask}
            onChange={searchQuery.setQuery}
            wide
          />
        </styled.Search>

        <styled.Filters>
          <Select
            wide
            options={sortOptions}
            value={sortField.fieldName}
            placeholder={t('actions.sort')}
            onSingleChange={(value) => sortField.setField(value || '')}
          />
          <Select
            wide
            options={filterOptions}
            value={filterField.fieldName}
            placeholder={t('actions.selectWallet')}
            onSingleChange={(value) => filterField.setField(value || '')}
          />
        </styled.Filters>
      </Frame>
      <styled.ScrollableContainer>
        <styled.SearchContainer>
          {stakeList.map((stake, index) => (
            <StakeCard
              key={index}
              nftName={stake.nftName}
              nftImageUrl={getImageAbsoluteUrl(stake.nftImage, ImageSizeEnum.S5)}
              stakedAmount={stake.stakedAmount}
              rewardAmount={stake.rewardAmount}
              tokenSymbol={stake.tokenSymbol}
              onInfoClick={() => onSelectStake(stake.uuid)}
              onStakeClick={() => onStake(stake.uuid)}
              onUnstakeClick={() => onUnstake(stake.nftId)}
            />
          ))}
        </styled.SearchContainer>
      </styled.ScrollableContainer>
    </styled.Wrapper>
  );
};

export default observer(StakeList);
