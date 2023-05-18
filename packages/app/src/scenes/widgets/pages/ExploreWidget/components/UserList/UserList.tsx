import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Slider, ItemCard, SliderItemInterface, ImageSizeEnum} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl} from 'core/utils';
import {SearchQueryModelModelType, UserInfoModelInterface} from 'core/models';

import * as styled from './UserList.styled';

interface PropsInterface {
  searchQuery: SearchQueryModelModelType;
  searchResults: UserInfoModelInterface[];
  lastCreatedUsers: SliderItemInterface<string>[];
  mostStakedUsers: SliderItemInterface<string>[];
  onSelectUser: (userId: string) => void;
}

const UserList: FC<PropsInterface> = ({
  searchQuery,
  searchResults,
  lastCreatedUsers,
  mostStakedUsers,
  onSelectUser
}) => {
  const {t} = useI18n();

  return (
    <styled.Wrapper data-testid="UserList-test">
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
              imageErrorIcon="astronaut"
              description={item.profile.bio}
              imageUrl={getImageAbsoluteUrl(item.profile.avatarHash, ImageSizeEnum.S5)}
              onInfoClick={() => onSelectUser(item.id)}
            />
          ))}
        </styled.SearchContainer>
      ) : (
        <styled.PopularContainer>
          <styled.BlockTitle>{t('labels.bigStakers')}</styled.BlockTitle>
          <styled.Carousel>
            <Slider
              items={mostStakedUsers}
              errorIcon="astronaut"
              onClick={(uuid) => onSelectUser(uuid)}
            />
          </styled.Carousel>
          <styled.BlockTitleTwo>{t('labels.newMembers')}</styled.BlockTitleTwo>
          <styled.Carousel>
            <Slider
              items={lastCreatedUsers}
              errorIcon="astronaut"
              onClick={(uuid) => onSelectUser(uuid)}
            />
          </styled.Carousel>
        </styled.PopularContainer>
      )}
    </styled.Wrapper>
  );
};

export default observer(UserList);
