import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Slider, ItemCard, SliderItemInterface, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {WorldInfoModelInterface, SearchQueryModelModelType} from 'core/models';

import * as styled from './WorldList.styled';

interface PropsInterface {
  searchQuery: SearchQueryModelModelType;
  searchResults: WorldInfoModelInterface[];
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
      {searchQuery.isQueryValid ? (
        <styled.SearchContainer>
          <styled.SearchResultTitle>
            <span>{t('labels.searchResults')}</span>
            <span>{searchResults.length}</span>
          </styled.SearchResultTitle>

          {searchResults.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              byName={item.owner_name || item.owner_id}
              imageErrorIcon="rabbit_fill"
              description={item.description}
              imageUrl={getImageAbsoluteUrl(item.avatarHash, ImageSizeEnum.S5)}
              onByNameClick={() => onSelectUser(item.owner_id)}
              onInfoClick={() => onSelectWorld(item.id)}
              onVisitClick={() => onVisitWorld(item.id)}
              onStakeClick={() => onStakeWorld(item.id)}
            />
          ))}
        </styled.SearchContainer>
      ) : (
        <styled.PopularContainer>
          <styled.BlockTitle>{t('labels.mostStakedIn')}</styled.BlockTitle>
          <styled.Carousel>
            <Slider items={mostStakedWorlds} onClick={(uuid) => onSelectWorld(uuid)} />
          </styled.Carousel>
          <styled.BlockTitleTwo>{t('labels.newOdysseys')}</styled.BlockTitleTwo>
          <styled.Carousel>
            <Slider items={lastCreatedWorlds} onClick={(uuid) => onSelectWorld(uuid)} />
          </styled.Carousel>
        </styled.PopularContainer>
      )}
    </styled.Wrapper>
  );
};

export default observer(WorldList);
