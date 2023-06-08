import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {format} from 'date-fns-tz';
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
  author_world_id?: string | null;
  author_world_name?: string | null;
  universal: boolean;
  entry_type: NewsfeedTypeEnum;
  created_at: string;
  data: NewsFeedMemberEntryDataInterface | NewsFeedMediaEntryDataInterface;
}

export interface NewsfeedEntryPropsInterface {
  entry: NewsfeedEntryInterface;
  onWorldOpen: (worldId: string) => void;
  onShare: (entry: NewsfeedEntryInterface) => void;
}

const NewsfeedEntry: FC<NewsfeedEntryPropsInterface> = ({entry, onWorldOpen, onShare}) => {
  const {t} = useI18n();

  const actionIconName: IconNameType = entryTypeIconMap[entry.entry_type as string];

  const generateMemberEntryContent = (
    id: string,
    data: NewsFeedMemberEntryDataInterface,
    type: NewsfeedTypeEnum
  ) => {
    return (
      <styled.TextEntryContainer>
        <Hexagon key={`${id}-author-avatar`} type="fifth-borderless" imageSrc={data.world_image} />
        <styled.TextEntryText>
          <styled.WorldName onClick={() => onWorldOpen(data.world_id!)}>
            {data.world_name}
          </styled.WorldName>
          &nbsp;
          {t(`newsfeed.${type}Message`, data)}
        </styled.TextEntryText>
      </styled.TextEntryContainer>
    );
  };

  const generateImageEntryContent = (id: string, data: NewsFeedMediaEntryDataInterface) => {
    if (!data.image) {
      return <></>;
    }
    return (
      <styled.MediaEntryContainer>
        <Image src={data.image} height={160} />
        {data.comment && <styled.MediaEntryComment>{data.comment}</styled.MediaEntryComment>}
        <styled.MediaEntryControlsContainer>
          <ButtonEllipse label="share" icon="share" onClick={() => onShare(entry)} />
          {data.world_id && (
            <ButtonEllipse
              label={t('actions.visitOdyssey')}
              icon="rocket_flying"
              onClick={() => onWorldOpen(data.world_id!)}
            />
          )}
        </styled.MediaEntryControlsContainer>
      </styled.MediaEntryContainer>
    );
  };

  const generateVideoEntryContent = (id: string, data: NewsFeedMediaEntryDataInterface) => {
    if (!data.video) {
      return <></>;
    }
    return (
      <styled.MediaEntryContainer>
        <styled.MediaEntryVideoContainer>
          <iframe
            key={data.video}
            title={t('plugin_video.labels.video') || ''}
            src={data.video}
            height="100%"
            width="100%"
            allowFullScreen
          ></iframe>
        </styled.MediaEntryVideoContainer>
        {data.comment && <styled.MediaEntryComment>{data.comment}</styled.MediaEntryComment>}
        <styled.MediaEntryControlsContainer>
          <ButtonEllipse label="share" icon="share" onClick={() => onShare(entry)} />
          {data.world_id && (
            <ButtonEllipse
              label={t('actions.visitOdyssey')}
              icon="rocket_flying"
              onClick={() => onWorldOpen(data.world_id!)}
            />
          )}
        </styled.MediaEntryControlsContainer>
      </styled.MediaEntryContainer>
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
  ) : entry.entry_type === NewsfeedTypeEnum.VIDEO ? (
    generateVideoEntryContent(entry.id, entry.data as NewsFeedMediaEntryDataInterface)
  ) : (
    <></>
  );

  const entryDate = new Date(entry.created_at);
  const entryDateFormatted = format(entryDate, 'yyyy-MM-dd');
  const entryTimeFormatted = format(entryDate, 'HH aa');

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

              {entry.author_world_name && entry.author_world_id && (
                <>
                  <styled.UserInfoSecondaryLink onClick={() => onWorldOpen(entry.author_world_id!)}>
                    {entry.author_world_name}
                  </styled.UserInfoSecondaryLink>
                  <styled.UserInfoSecondaryText className="separator">
                    /
                  </styled.UserInfoSecondaryText>
                </>
              )}
              <styled.UserInfoSecondaryText>{entryDateFormatted}</styled.UserInfoSecondaryText>
              <styled.UserInfoSecondaryText className="separator">/</styled.UserInfoSecondaryText>
              <styled.UserInfoSecondaryText>{entryTimeFormatted}</styled.UserInfoSecondaryText>
            </styled.UserInfoSecondary>
          </styled.UserInfo>
        </styled.Header>
        <styled.Content>{content}</styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(NewsfeedEntry);
