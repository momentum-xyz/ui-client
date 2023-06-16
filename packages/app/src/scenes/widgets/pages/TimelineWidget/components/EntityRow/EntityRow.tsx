import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {ListChildComponentProps} from 'react-window';
import {PostTypeEnum} from '@momentum-xyz/core';
import {
  ImageSizeEnum,
  PostAuthorInterface,
  PostEntryInterface,
  PostImageView,
  PostTypeSelector,
  PostVideoView
} from '@momentum-xyz/ui-kit';

import {getImageAbsoluteUrl, getVideoAbsoluteUrl} from 'core/utils';

import * as styled from './EntityRow.styled';

const EntityRow: FC<ListChildComponentProps> = ({index, style, data}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rowRef.current) {
      data.setRowHeight(index, rowRef.current.clientHeight);
    }
  }, [index]);

  const entry = data.items[index];

  if (!entry) {
    return <></>;
  }

  const postAuthor: PostAuthorInterface = {
    id: entry.user_id,
    name: entry.user_name,
    avatarSrc: getImageAbsoluteUrl(entry.avatar_hash),
    isItMe: entry.user_id === data.user.id
  };

  const postEntry: PostEntryInterface = {
    id: entry.activity_id,
    description: entry.data.description,
    type: entry.type,
    objectId: entry.object_id,
    objectName: entry.world_name,
    created: entry.created_at,
    hashSrc:
      entry.type === PostTypeEnum.VIDEO
        ? getVideoAbsoluteUrl(entry.data.hash)
        : getImageAbsoluteUrl(entry.data.hash, ImageSizeEnum.S5)
  };

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
            {entry.type === PostTypeEnum.SCREENSHOT && (
              <PostImageView
                entry={postEntry}
                author={postAuthor}
                onShare={() => data.handleShare(entry)}
                onEdit={() => data.handleEdit(entry)}
              />
            )}

            {/* VIDEO VIEW */}
            {entry.type === PostTypeEnum.VIDEO && (
              <PostVideoView
                entry={postEntry}
                author={postAuthor}
                onShare={() => data.handleShare(entry)}
                onEdit={() => data.handleEdit(entry)}
              />
            )}
          </>
        )}

        {/*<PostEntry
          author={{
            id: entry.user_id,
            name: entry.user_name,
            avatarSrc: getImageAbsoluteUrl(entry.avatar_hash),
            isItMe: entry.user_id === data.user.id
          }}
          entry={{
            id: entry.activity_id,
            description: entry.data.description,
            type: entry.type,
            objectId: entry.object_id,
            objectName: entry.world_name,
            created: entry.created_at,
            hashSrc:
              entry.type === PostTypeEnum.VIDEO
                ? getVideoAbsoluteUrl(entry.data.hash)
                : getImageAbsoluteUrl(entry.data.hash, ImageSizeEnum.S5)
          }}
          canEdit={data.isMyWorld || entry.user_id === data.user.id}
          videoOrScreenshot={data.screenshotOrVideo}
          isPending={data.isPending}
          isScreenRecording={data.isScreenRecording}
          onClearVideoOrScreenshot={data.handleClearFile}
          onMakeScreenshot={data.handleMakeScreenshot}
          onStartRecording={data.handleStartRecording}
          onStopRecording={data.handleStopRecording}
          onCreateOrUpdatePost={(form) => {
            return data.handleUpdatePost(form, entry);
          }}
          onDelete={() => data.handleDeletePost(entry)}
          onCancelCreation={data.handleClearFile}
        />*/}
      </styled.EntryItem>
    </div>
  );
};

export default observer(EntityRow);
