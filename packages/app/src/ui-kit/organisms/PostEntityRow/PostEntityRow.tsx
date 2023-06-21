import {FC, useEffect, useMemo, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {ListChildComponentProps} from 'react-window';
import {TimelineTypeEnum} from '@momentum-xyz/core';
import {
  ImageSizeEnum,
  PostAuthorInterface,
  PostEntryInterface,
  PostImageView,
  PostStakeView,
  PostTypeSelector,
  PostVideoView,
  PostWorldView
} from '@momentum-xyz/ui-kit';

import {formatBigInt, getImageAbsoluteUrl, getVideoAbsoluteUrl} from 'core/utils';

import * as styled from './PostEntityRow.styled';

const PostEntityRow: FC<ListChildComponentProps> = ({index, style, data}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const entry = useMemo(() => {
    return data.items[index];
  }, [data, index]);

  useEffect(() => {
    if (rowRef.current) {
      data.setRowHeight(index, rowRef.current.clientHeight);
    }
  }, [index, data, entry?.description]);

  if (!entry) {
    return <></>;
  }

  const postAuthor: PostAuthorInterface = {
    id: entry.user_id,
    name: entry.user_name,
    avatarSrc: getImageAbsoluteUrl(entry.avatar_hash)
  };

  const postEntry: PostEntryInterface = {
    id: entry.activity_id,
    description: entry.data.description,
    type: entry.type,
    created: entry.created_at,
    objectId: entry.object_id,
    objectName: entry.world_name,
    objectAvatarSrc: getImageAbsoluteUrl(entry.world_avatar_hash) || undefined,
    tokenSymbol: entry.token_symbol,
    tokenAmount: formatBigInt(entry.token_amount),
    hashSrc:
      entry.type === TimelineTypeEnum.VIDEO
        ? getVideoAbsoluteUrl(entry.data.hash)
        : getImageAbsoluteUrl(entry.data.hash, ImageSizeEnum.S5)
  };

  const isEditable = data.isMyWorld || entry.user_id === data.user?.id;
  const shareUrl = `${document.location.origin}/odyssey/${entry.object_id}`;

  return (
    <div style={style} data-testid="EntityRow-test">
      <styled.EntryItem ref={rowRef}>
        {/* A NEW POST TYPE SELECTOR */}
        {data.isCreationShown && index === 0 ? (
          <PostTypeSelector
            author={{
              id: data.user.id,
              name: data.user.name,
              avatarSrc: data.user.avatarSrc || null,
              isItMe: true
            }}
            onSelect={data.setPostTypeIntent}
          />
        ) : (
          <>
            {/* SCREENSHOT VIEW */}
            {entry.type === TimelineTypeEnum.SCREENSHOT && (
              <PostImageView
                entry={postEntry}
                author={postAuthor}
                shareUrl={shareUrl}
                onEdit={isEditable ? () => data.handleEdit(entry) : undefined}
              />
            )}

            {/* VIDEO VIEW */}
            {entry.type === TimelineTypeEnum.VIDEO && (
              <PostVideoView
                entry={postEntry}
                author={postAuthor}
                shareUrl={shareUrl}
                onEdit={isEditable ? () => data.handleEdit(entry) : undefined}
              />
            )}

            {/* NEW WORLD VIEW */}
            {entry.type === TimelineTypeEnum.WORLD_CREATE && (
              <PostWorldView
                entry={postEntry}
                author={postAuthor}
                shareUrl={shareUrl}
                onVisit={() => data.handleVisit(entry.object_id)}
              />
            )}

            {/* STAKE VIEW */}
            {entry.type === TimelineTypeEnum.STAKE && (
              <PostStakeView
                entry={postEntry}
                author={postAuthor}
                shareUrl={shareUrl}
                onVisit={() => data.handleVisit(entry.object_id)}
              />
            )}

            {/* UNKNOWN TYPE */}
            {![
              TimelineTypeEnum.WORLD_CREATE,
              TimelineTypeEnum.SCREENSHOT,
              TimelineTypeEnum.VIDEO,
              TimelineTypeEnum.STAKE
            ].includes(entry.type) && <div>{entry.type} is an unknown type.</div>}
          </>
        )}
      </styled.EntryItem>
    </div>
  );
};

export default observer(PostEntityRow);
