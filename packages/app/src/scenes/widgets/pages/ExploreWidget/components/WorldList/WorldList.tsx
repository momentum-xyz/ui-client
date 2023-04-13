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
  lastCreatedWorlds: SliderItemInterface<string>[];
  mostStakedWorlds: SliderItemInterface<string>[];
  onSelectWorld: (worldId: string) => void;
  onSelectUser: (users: string) => void;
  onVisitWorld: (worldId: string) => void;
  onStakeWorld: (worldId: string) => void;
}

const WorldList: FC<PropsInterface> = ({
  searchQuery,
  searchResults,
  lastCreatedWorlds,
  mostStakedWorlds,
  onSelectWorld,
  onSelectUser,
  onVisitWorld,
  onStakeWorld
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="WorldList-test">
      <Frame>
        <styled.Search>
          <Input
            isSearch
            isClearable
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
            <styled.SearchResultTitle>
              {`${searchResults.length} ${t('labels.results')}`}
            </styled.SearchResultTitle>

            {searchResults.map((item) => (
              <ItemCard
                key={item.id}
                name={item.name}
                byName={item.name}
                image={item.image}
                imageErrorIcon="rabbit_fill"
                description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
                onByNameClick={() => onSelectUser(item.uuid)}
                onInfoClick={() => onSelectWorld(item.uuid)}
                onVisitClick={() => onVisitWorld(item.uuid)}
                onStakeClick={() => onStakeWorld(item.uuid)}
              />
            ))}
          </styled.SearchContainer>
        ) : (
          <styled.PopularContainer>
            <styled.BlockTitle>{t('labels.mostStakedIn')}</styled.BlockTitle>
            <styled.Carousel>
              <Slider items={mostStakedWorlds} onClick={(uuid) => onSelectWorld(uuid)} />
            </styled.Carousel>
            <styled.BlockTitle>{t('labels.newOdysseys')}</styled.BlockTitle>
            <styled.Carousel>
              <Slider items={lastCreatedWorlds} onClick={(uuid) => onSelectWorld(uuid)} />
            </styled.Carousel>
          </styled.PopularContainer>
        )}
      </styled.ScrollableContainer>
    </styled.Wrapper>
  );
};

export default observer(WorldList);
