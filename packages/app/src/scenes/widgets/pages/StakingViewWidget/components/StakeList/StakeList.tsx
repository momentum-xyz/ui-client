import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Input,
  Frame,
  stringInputMask,
  Select,
  StakeCard,
  SelectOptionInterface,
  doThreeDotsInside
} from '@momentum-xyz/ui-kit-storybook';

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
            isClearable
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
            isClearable
            options={sortOptions}
            value={sortField.fieldName}
            placeholder={t('actions.sort')}
            onSingleChange={(value) => sortField.setField(value || '')}
          />
          <Select
            wide
            isClearable
            options={filterOptions.map((option) => ({
              ...option,
              label: doThreeDotsInside(option.label, 5, 5)
            }))}
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
              nftName={stake.name}
              nftImageUrl={null} // ???
              stakedAmount={Number(stake.amount)}
              rewardAmount={Number(stake.reward)}
              tokenSymbol="MOM"
              onInfoClick={() => onSelectStake(stake.blockchain_id)}
              onStakeClick={() => onStake(stake.blockchain_id)}
              onUnstakeClick={() => onUnstake(stake.blockchain_id)}
            />
          ))}
        </styled.SearchContainer>
      </styled.ScrollableContainer>
    </styled.Wrapper>
  );
};

export default observer(StakeList);
