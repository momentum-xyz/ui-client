import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  doThreeDotsInside,
  Frame,
  ImageSizeEnum,
  Input,
  Select,
  SelectOptionInterface,
  StakeCard,
  stringInputMask
} from '@momentum-xyz/ui-kit';

import {StakeSortType} from 'core/types';
import {formatBigInt, getImageAbsoluteUrl, tokenKindToSymbol} from 'core/utils';
import {
  FilterFieldModelType,
  SearchQueryModelModelType,
  SortFieldModelType,
  StakeModelInterface,
  WorldInfoModelInterface
} from 'core/models';

import * as styled from './StakeList.styled';
import {UnstakeWorld} from './components';

interface PropsInterface {
  searchQuery: SearchQueryModelModelType;
  stakeList: StakeModelInterface[];
  isStakeListEmpty: boolean;
  mostStakedWorlds: WorldInfoModelInterface[];
  filterField: FilterFieldModelType;
  filterOptions: SelectOptionInterface<string>[];
  sortField: SortFieldModelType;
  sortOptions: SelectOptionInterface<StakeSortType>[];
  onReloadStakes: () => void;
  onSelectWorld: (worldId: string) => void;
  onStake: (worldId: string) => void;
}

const StakeList: FC<PropsInterface> = ({
  searchQuery,
  stakeList,
  isStakeListEmpty,
  mostStakedWorlds,
  filterField,
  filterOptions,
  sortField,
  sortOptions,
  onReloadStakes,
  onSelectWorld,
  onStake
}) => {
  const [stakeForUnstake, setStakeForUnstake] = useState<StakeModelInterface>();

  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="StakeList-test">
      <Frame>
        <styled.Search>
          <Input
            isSearch
            isClearable
            disabled={isStakeListEmpty}
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
            isDisabled={isStakeListEmpty}
            options={sortOptions}
            value={sortField.fieldName}
            placeholder={t('actions.sort')}
            onSingleChange={(value) => sortField.setField(value || '')}
          />
          <Select
            wide
            isClearable
            isDisabled={isStakeListEmpty}
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

      <styled.SearchContainer>
        {isStakeListEmpty ? (
          <>
            {/* RENDER MOST STAKED WORLDS */}
            <styled.NoOwnStakes>
              Make your first stake, here are the most staked into Odysseys
            </styled.NoOwnStakes>
            {mostStakedWorlds.map((stake, index) => (
              <StakeCard
                key={index}
                worldName={stake.name}
                worldImageUrl={getImageAbsoluteUrl(stake.avatarHash, ImageSizeEnum.S5)}
                staked={formatBigInt(stake.stake_total)}
                tokenSymbol="MOM"
                onInfoClick={() => onSelectWorld(stake.id)}
                onStakeClick={() => onStake(stake.id)}
              />
            ))}
          </>
        ) : (
          <>
            {/* RENDER MY STAKES */}
            {stakeList.map((stake, index) => (
              <StakeCard
                key={index}
                worldName={stake.name}
                worldImageUrl={getImageAbsoluteUrl(stake.avatar_hash, ImageSizeEnum.S5)}
                staked={formatBigInt(stake.amount)}
                reward={formatBigInt(stake.reward)}
                tokenSymbol={tokenKindToSymbol(stake.kind)}
                onInfoClick={() => onSelectWorld(stake.object_id)}
                onStakeClick={() => onStake(stake.object_id)}
                onUnstakeClick={() => {
                  setStakeForUnstake(stake);
                }}
              />
            ))}

            {stakeForUnstake && (
              <UnstakeWorld
                targetStake={stakeForUnstake}
                onUnStaked={() => {
                  setStakeForUnstake(undefined);
                  onReloadStakes();
                }}
                onCanceled={() => {
                  setStakeForUnstake(undefined);
                }}
              />
            )}
          </>
        )}
      </styled.SearchContainer>
    </styled.Wrapper>
  );
};

export default observer(StakeList);
