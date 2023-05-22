import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Frame, Hexagon, IconSvg, IconNameType} from '@momentum-xyz/ui-kit';

import {NewsfeedEntryModelInterface} from 'core/models';
import {NewsfeedTypeEnum} from 'core/enums';

import * as styled from './NewsfeedEntry.styled';

const entryTypeIconMap: {[key: string]: IconNameType} = {
  [NewsfeedTypeEnum.CREATED]: 'star',
  [NewsfeedTypeEnum.BOOST]: 'stake'
};

interface PropsInterface {
  entry: NewsfeedEntryModelInterface;
  onWorldOpen: (entry: NewsfeedEntryModelInterface) => void;
}

const NewsfeedEntry: FC<PropsInterface> = ({entry, onWorldOpen}) => {
  const {t} = useI18n();

  const actionIconName: IconNameType = entryTypeIconMap[entry.entry_type as string];

  const handleWorldClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    onWorldOpen(entry);
  };

  const content = [NewsfeedTypeEnum.CREATED, NewsfeedTypeEnum.BOOST].includes(entry.entry_type) ? (
    <styled.TextEntryContainer>
      <Hexagon
        key={`${entry.id}-author-avatar`}
        type="fifth-borderless"
        imageSrc={entry.data.world_image}
      />
      <styled.TextEntryText>
        <styled.WorldName onClick={handleWorldClick}>{entry.data.world_name}</styled.WorldName>
        &nbsp;
        {t(`newsfeed.${entry.entry_type}Message`, entry.data)}
      </styled.TextEntryText>
    </styled.TextEntryContainer>
  ) : (
    <></>
  );

  return (
    <styled.Wrapper data-testid="NewsfeedEntry-test">
      <Frame>
        <styled.Header>
          <Hexagon
            key={`${entry.id}-author-avatar`}
            type="fourth-borderless"
            imageSrc={entry.author_avatar}
          />
          <styled.UserInfo className="user-info-container">
            <styled.UserInfoTitle>{entry.author_name}</styled.UserInfoTitle>
            <styled.UserInfoSecondary>
              <IconSvg name={actionIconName} size="xs" isWhite />
              <styled.UserInfoSecondaryText className="world-name">
                {entry.data.world_name}
              </styled.UserInfoSecondaryText>
              <styled.UserInfoSecondaryText className="separator">/</styled.UserInfoSecondaryText>
              <styled.UserInfoSecondaryText>2023-01-16</styled.UserInfoSecondaryText>
              <styled.UserInfoSecondaryText className="separator">/</styled.UserInfoSecondaryText>
              <styled.UserInfoSecondaryText>9 PM</styled.UserInfoSecondaryText>
            </styled.UserInfoSecondary>
          </styled.UserInfo>
        </styled.Header>
        <styled.Content>{content}</styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(NewsfeedEntry);
