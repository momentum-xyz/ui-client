import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Input,
  Frame,
  Slider,
  stringInputMask,
  SliderItemInterface
} from '@momentum-xyz/ui-kit-storybook';

import {ItemCard} from 'ui-kit';
import {NftItemModelInterface, SearchQueryModelModelType} from 'core/models';

import * as styled from './WorldList.styled';

interface PropsInterface {
  searchQuery: SearchQueryModelModelType;
  searchResults: NftItemModelInterface[];
  lastCreatedItems: SliderItemInterface<string>[];
  mostStakedInItems: SliderItemInterface<string>[];
  onWorldClick: (worldId: string) => void;
  onUserClick: (users: string) => void;
  onVisit: (worldId: string) => void;
  onStake: (worldId: string) => void;
}

const WorldList: FC<PropsInterface> = ({
  searchQuery,
  searchResults,
  lastCreatedItems,
  mostStakedInItems,
  onWorldClick,
  onUserClick,
  onVisit,
  onStake
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="WorldList-test">
      <Frame>
        <styled.Search>
          <Input
            isSearch
            value={searchQuery.query}
            placeholder={t('actions.searchOdysseys')}
            opts={stringInputMask}
            onChange={searchQuery.setQuery}
            wide
          />
        </styled.Search>
      </Frame>
      <styled.ScrollableContainer>
        {searchQuery.isQueryValid ? (
          <styled.SearchContainer>
            <styled.SearchResultTitle>{t('labels.searchResults')}</styled.SearchResultTitle>
            {searchResults.map((item) => (
              <ItemCard
                key={item.id}
                name={item.name}
                byName={item.name}
                image={item.image}
                imageErrorIcon="rabbit_fill"
                description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
                onByNameClick={() => onUserClick(item.uuid)}
                onInfoClick={() => onWorldClick(item.uuid)}
                onVisitClick={() => onVisit(item.uuid)}
                onStakeClick={() => onStake(item.uuid)}
              />
            ))}
          </styled.SearchContainer>
        ) : (
          <styled.PopularContainer>
            <styled.BlockTitle>{t('labels.mostStakedIn')}</styled.BlockTitle>
            <styled.Carousel>
              <Slider items={mostStakedInItems} onClick={(uuid) => onWorldClick(uuid)} />
            </styled.Carousel>
            <styled.BlockTitle>{t('labels.newOdysseys')}</styled.BlockTitle>
            <styled.Carousel>
              <Slider items={lastCreatedItems} onClick={(uuid) => onWorldClick(uuid)} />
            </styled.Carousel>
          </styled.PopularContainer>
        )}
      </styled.ScrollableContainer>
    </styled.Wrapper>
  );
};

export default observer(WorldList);
