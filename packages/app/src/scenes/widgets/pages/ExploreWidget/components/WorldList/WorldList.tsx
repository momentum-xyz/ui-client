import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {
  Input,
  Frame,
  Slider,
  stringInputMask,
  SliderItemInterface,
  ButtonEllipse
} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
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
  return (
    <styled.Wrapper data-testid="WorldList-test">
      <Frame>
        <styled.Search>
          <Input
            isSearch
            value={searchQuery.query}
            placeholder="Search odysseys"
            opts={stringInputMask}
            onChange={searchQuery.setQuery}
            wide
          />
        </styled.Search>
      </Frame>
      <styled.WorldsContainer>
        {searchQuery.isQueryValid ? (
          <styled.SearchContainer>
            <styled.SearchResultTitle>Search results</styled.SearchResultTitle>

            {searchResults.map((item) => (
              <styled.SearchResultItem key={item.id}>
                <styled.Image src={getImageAbsoluteUrl(item.image) || ''} />
                <styled.ItemContent>
                  <styled.ItemNameContainer>
                    <styled.ItemName>{item.name}</styled.ItemName>
                    <span>
                      {'By: '}
                      <styled.ItemLink onClick={() => onUserClick(item.uuid)}>
                        {item.name}
                      </styled.ItemLink>
                    </span>
                  </styled.ItemNameContainer>
                  <styled.ItemDesc>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  </styled.ItemDesc>
                  <styled.Actions>
                    <ButtonEllipse
                      label="Info"
                      icon="info_2"
                      onClick={() => onWorldClick(item.uuid)}
                    />
                    <ButtonEllipse label="Visit" icon="fly-to" onClick={() => onVisit(item.uuid)} />
                    <ButtonEllipse label="Stake" icon="stake" onClick={() => onStake(item.uuid)} />
                  </styled.Actions>
                </styled.ItemContent>
              </styled.SearchResultItem>
            ))}
          </styled.SearchContainer>
        ) : (
          <styled.PopularContainer>
            <styled.BlockTitle>Most Staked In</styled.BlockTitle>
            <styled.Carousel>
              <Slider items={mostStakedInItems} onClick={(uuid) => onWorldClick(uuid)} />
            </styled.Carousel>
            <styled.BlockTitle>New Odysseys</styled.BlockTitle>
            <styled.Carousel>
              <Slider items={lastCreatedItems} onClick={(uuid) => onWorldClick(uuid)} />
            </styled.Carousel>
          </styled.PopularContainer>
        )}
      </styled.WorldsContainer>
    </styled.Wrapper>
  );
};

export default observer(WorldList);
