import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {
  Input,
  Image,
  Frame,
  Slider,
  ButtonEllipse,
  stringInputMask,
  SliderItemInterface
} from '@momentum-xyz/ui-kit-storybook';

import {getImageAbsoluteUrl} from 'core/utils';
import {NftItemModelInterface, SearchQueryModelModelType} from 'core/models';

import * as styled from './UserList.styled';

interface PropsInterface {
  searchQuery: SearchQueryModelModelType;
  searchResults: NftItemModelInterface[];
  lastCreatedItems: SliderItemInterface<string>[];
  mostStakedItems: SliderItemInterface<string>[];
  onUserClick: (userId: string) => void;
  onVisit: (userId: string) => void;
}

const UserList: FC<PropsInterface> = ({
  searchQuery,
  searchResults,
  lastCreatedItems,
  mostStakedItems,
  onUserClick,
  onVisit
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="UserList-test">
      <Frame>
        <styled.Search>
          <Input
            isSearch
            value={searchQuery.query}
            placeholder={t('actions.searchMembers')}
            opts={stringInputMask}
            onChange={searchQuery.setQuery}
            wide
          />
        </styled.Search>
      </Frame>
      <styled.WorldsContainer>
        {searchQuery.isQueryValid ? (
          <styled.SearchContainer>
            <styled.SearchResultTitle>{t('labels.searchResults')}</styled.SearchResultTitle>

            {searchResults.map((item) => (
              <styled.SearchResultItem key={item.id}>
                <Image
                  src={getImageAbsoluteUrl(item.image)}
                  errorIcon="astronaut"
                  onClick={() => onUserClick(item.uuid)}
                />
                <styled.ItemContent>
                  <styled.ItemName>{item.name}</styled.ItemName>
                  <styled.ItemDesc>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  </styled.ItemDesc>
                  <styled.Actions>
                    <ButtonEllipse
                      label={t('actions.info')}
                      icon="info_2"
                      onClick={() => onUserClick(item.uuid)}
                    />
                    <ButtonEllipse
                      label={t('actions.visit')}
                      icon="fly-to"
                      onClick={() => onVisit(item.uuid)}
                    />
                  </styled.Actions>
                </styled.ItemContent>
              </styled.SearchResultItem>
            ))}
          </styled.SearchContainer>
        ) : (
          <styled.PopularContainer>
            <styled.BlockTitle>{t('labels.mostStakedMembers')}</styled.BlockTitle>
            <styled.Carousel>
              <Slider
                items={mostStakedItems}
                errorIcon="astronaut"
                onClick={(uuid) => onUserClick(uuid)}
              />
            </styled.Carousel>
            <styled.BlockTitle>{t('labels.newMembers')}</styled.BlockTitle>
            <styled.Carousel>
              <Slider
                items={lastCreatedItems}
                errorIcon="astronaut"
                onClick={(uuid) => onUserClick(uuid)}
              />
            </styled.Carousel>
          </styled.PopularContainer>
        )}
      </styled.WorldsContainer>
    </styled.Wrapper>
  );
};

export default observer(UserList);
