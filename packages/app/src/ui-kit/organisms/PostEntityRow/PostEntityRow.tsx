import {FC, useEffect, useMemo, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {ListChildComponentProps} from 'react-window';
import {TimelineTypeEnum} from '@momentum-xyz/core';
import {
  ImageSizeEnum,
  PostAuthorInterface,
  PostEntryInterface,
  PostImageView,
  PostTypeSelector,
  PostVideoView
} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl, getVideoAbsoluteUrl} from 'core/utils';

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
    objectId: entry.object_id,
    objectName: entry.world_name,
    created: entry.created_at,
    hashSrc:
      entry.type === TimelineTypeEnum.VIDEO
        ? getVideoAbsoluteUrl(entry.data.hash)
        : getImageAbsoluteUrl(entry.data.hash, ImageSizeEnum.S5)
  };

  const isEditable = data.isMyWorld || entry.user_id === data.user?.id;

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
                shareUrl={`${document.location.origin}/odyssey/${entry.object_id}`}
                onEdit={isEditable ? () => data.handleEdit(entry) : undefined}
              />
            )}

            {/* VIDEO VIEW */}
            {entry.type === TimelineTypeEnum.VIDEO && (
              <PostVideoView
                entry={postEntry}
                author={postAuthor}
                shareUrl={`${document.location.origin}/odyssey/${entry.object_id}`}
                onEdit={isEditable ? () => data.handleEdit(entry) : undefined}
              />
            )}

            {/* UNKNOWN TYPE */}
            {![TimelineTypeEnum.SCREENSHOT, TimelineTypeEnum.VIDEO].includes(entry.type) && (
              <div>{entry.type} is an unknown type.</div>
            )}
          </>
        )}
      </styled.EntryItem>
    </div>
  );
};

export default observer(PostEntityRow);
