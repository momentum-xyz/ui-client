import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, NewsfeedTypeEnum} from '@momentum-xyz/core';
import {PostTypeEnum} from '@momentum-xyz/core';

import {Frame, Hexagon} from '../../atoms';
import {PostHeading} from '../../molecules';
import {PostAuthorInterface, PostEntryInterface} from '../../interfaces';
import {PostImageView} from '../PostEntry/components';

import * as styled from './NewsfeedEntry.styled';

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

  const generateImageEntryContent = (
    id: string,
    data: NewsFeedMediaEntryDataInterface,
    entry: NewsfeedEntryInterface
  ) => {
    if (!data.image) {
      return <></>;
    }

    return (
      <PostImageView
        imageSrc={data.image}
        description={data.comment}
        onVisit={() => onWorldOpen(data.world_id!)}
        onShare={() => onShare(entry)}
      />
    );
  };

  const content = [NewsfeedTypeEnum.CREATED, NewsfeedTypeEnum.BOOST].includes(entry.entry_type) ? (
    generateMemberEntryContent(
      entry.id,
      entry.data as NewsFeedMemberEntryDataInterface,
      entry.entry_type
    )
  ) : entry.entry_type === NewsfeedTypeEnum.IMAGE ? (
    generateImageEntryContent(entry.id, entry.data as NewsFeedMediaEntryDataInterface, entry)
  ) : (
    <></>
  );

  const author: PostAuthorInterface = {
    id: entry.author_id,
    name: entry.author_name,
    avatarSrc: entry.author_avatar,
    isItMe: false
  }; // tmp

  const postEntry: PostEntryInterface = {
    id: entry.id,
    hashSrc: `some_hash`,
    description: (entry.data as any)?.comment || null,
    type: PostTypeEnum.EVENT,
    objectId: (entry.data as any)?.world_id || undefined,
    objectName: (entry.data as any)?.world_name || undefined,
    created: entry.created_at
  };

  return (
    <styled.Wrapper data-testid="NewsfeedEntry-test">
      <Frame>
        <PostHeading author={author} entry={postEntry} />
        <styled.Content>{content}</styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(NewsfeedEntry);
