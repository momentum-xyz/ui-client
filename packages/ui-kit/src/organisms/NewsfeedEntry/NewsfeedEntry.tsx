import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, NewsfeedTypeEnum} from '@momentum-xyz/core';

import {Frame, Hexagon, IconSvg, Image, ButtonEllipse} from '../../atoms';
import {IconNameType} from '../../types';

import * as styled from './NewsfeedEntry.styled';

const entryTypeIconMap: {[key: string]: IconNameType} = {
  [NewsfeedTypeEnum.CREATED]: 'star',
  [NewsfeedTypeEnum.BOOST]: 'stake',
  [NewsfeedTypeEnum.IMAGE]: 'photo_camera',
  [NewsfeedTypeEnum.VIDEO]: 'screenshare'
};

export interface NewsFeedMemberEntryDataInterface {
  world_id: string | null;
  world_name: string | null;
  world_image: string | null;

  user_name: string | null;
  amount: number | null;
}

export interface NewsFeedMediaEntryDataInterface {
  image: string | null;
  video: string | null;
  world_id: string | null;
  comment: string | null;
}

export interface NewsfeedEntryInterface {
  id: string;
  author_name: string;
  author_id: string;
  author_avatar: string | null;
  universal: boolean;
  entry_type: NewsfeedTypeEnum;
  created_at: string;
  data: NewsFeedMemberEntryDataInterface | NewsFeedMediaEntryDataInterface;
}

export interface NewsfeedEntryPropsInterface {
  entry: NewsfeedEntryInterface;
  onWorldOpen: (entry: NewsfeedEntryInterface) => void;
  onShare: (entry: NewsfeedEntryInterface) => void;
}

const NewsfeedEntry: FC<NewsfeedEntryPropsInterface> = ({entry, onWorldOpen, onShare}) => {
  const {t} = useI18n();

  const actionIconName: IconNameType = entryTypeIconMap[entry.entry_type as string];
  console.log(actionIconName);

  const handleWorldClick = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    onWorldOpen(entry);
  };

  const generateMemberEntryContent = (
    id: string,
    data: NewsFeedMemberEntryDataInterface,
    type: NewsfeedTypeEnum
  ) => {
    return (
      <styled.TextEntryContainer>
        <Hexagon key={`${id}-author-avatar`} type="fifth-borderless" imageSrc={data.world_image} />
        <styled.TextEntryText>
          <styled.WorldName onClick={handleWorldClick}>{data.world_name}</styled.WorldName>
          &nbsp;
          {t(`newsfeed.${type}Message`, data)}
        </styled.TextEntryText>
      </styled.TextEntryContainer>
    );
  };

  const generateImageEntryContent = (id: string, data: NewsFeedMediaEntryDataInterface) => {
    return (
      <styled.ImageEntryContainer>
        <Image src={data.image} height={160} />
        {data.comment && <styled.ImageEntryComment>{data.comment}</styled.ImageEntryComment>}
        <styled.ImageEntryControlsContainer>
          <ButtonEllipse label="share" icon="share" onClick={() => onShare(entry)} />
          {data.world_id && (
            <ButtonEllipse
              label={t('actions.visitOdyssey')}
              icon="rocket_flying"
              onClick={() => onWorldOpen(entry)}
            />
          )}
        </styled.ImageEntryControlsContainer>
      </styled.ImageEntryContainer>
    );
  };

  const content = [NewsfeedTypeEnum.CREATED, NewsfeedTypeEnum.BOOST].includes(entry.entry_type) ? (
    generateMemberEntryContent(
      entry.id,
      entry.data as NewsFeedMemberEntryDataInterface,
      entry.entry_type
    )
  ) : entry.entry_type === NewsfeedTypeEnum.IMAGE ? (
    generateImageEntryContent(entry.id, entry.data as NewsFeedMediaEntryDataInterface)
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

              {(entry.data as NewsFeedMemberEntryDataInterface).world_name && (
                <>
                  <styled.UserInfoSecondaryText className="world-name">
                    {(entry.data as NewsFeedMemberEntryDataInterface).world_name}
                  </styled.UserInfoSecondaryText>
                  <styled.UserInfoSecondaryText className="separator">
                    /
                  </styled.UserInfoSecondaryText>
                </>
              )}
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
