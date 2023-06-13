import {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {MediaInterface, PostTypeEnum, useI18n} from '@momentum-xyz/core';

import {PostAuthorInterface, PostEntryInterface, PostFormInterface} from '../../interfaces';
import {ButtonEllipse, Frame} from '../../atoms';
import {PostHeading} from '../../molecules';

import {
  PostTypeSelector,
  PostImageForm,
  PostVideoForm,
  PostImageView,
  PostVideoView
} from './components';
import * as styled from './PostEntry.styled';

const MAX_VIDEO_DURATION = 15;

export interface PostEntryPropsInterface {
  entry?: PostEntryInterface;
  author: PostAuthorInterface;
  canEdit?: boolean;
  videoOrScreenshot?: MediaInterface | null;
  isPending?: boolean;
  isScreenRecording?: boolean;
  onMakeScreenshot: () => void;
  onStartRecording: (maxDuration: number) => void;
  onStopRecording: () => void;
  onClearVideoOrScreenshot: () => void;
  onCreateOrUpdatePost: (form: PostFormInterface, type: PostTypeEnum) => Promise<boolean>;
  onCancelCreation: () => void;
  onDelete?: () => void;
  onVisit?: () => void;
  onShare?: () => void;
}

type ModeType = 'view' | 'edit';

const PostEntry: FC<PostEntryPropsInterface> = ({
  author,
  entry,
  canEdit,
  videoOrScreenshot,
  isPending,
  isScreenRecording,
  onMakeScreenshot,
  onStartRecording,
  onStopRecording,
  onClearVideoOrScreenshot,
  onCreateOrUpdatePost,
  onCancelCreation,
  onDelete,
  onShare,
  onVisit
}) => {
  const [postTypeIntent, setPostTypeIntent] = useState<PostTypeEnum | null>(null);
  const [mode, setMode] = useState<ModeType>('view');

  const {t} = useI18n();

  const handleBack = () => {
    setPostTypeIntent(null);
    onCancelCreation();
  };

  const handleCreateOrUpdate = async (form: PostFormInterface, postType: PostTypeEnum) => {
    if (await onCreateOrUpdatePost(form, postType)) {
      setPostTypeIntent(null);
    }
  };

  return (
    <styled.Wrapper data-testid="PostEntry-test">
      <Frame>
        {/* HEADER */}
        <PostHeading author={author} entry={entry} />

        <styled.Content>
          {/* Creator */}
          {!entry ? (
            <>
              {/* Select a type of new post */}
              {!postTypeIntent && (
                <>
                  <PostTypeSelector onSelect={setPostTypeIntent} />
                  <styled.Controls>
                    <ButtonEllipse icon="add" label={t('actions.addToTimeline')} disabled />
                  </styled.Controls>
                </>
              )}

              {/* Create a new screenshot */}
              {postTypeIntent === PostTypeEnum.SCREENSHOT && (
                <PostImageForm
                  screenshot={videoOrScreenshot?.file}
                  isPending={isPending}
                  onMakeScreenshot={onMakeScreenshot}
                  onClearScreenshot={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.SCREENSHOT)}
                  onCancel={handleBack}
                />
              )}

              {/* Create a new video */}
              {postTypeIntent === PostTypeEnum.VIDEO && (
                <PostVideoForm
                  video={videoOrScreenshot?.file}
                  isPending={isPending}
                  isScreenRecording={isScreenRecording}
                  maxVideoDurationSec={MAX_VIDEO_DURATION}
                  onStartRecording={() => onStartRecording(MAX_VIDEO_DURATION)}
                  onStopRecording={onStopRecording}
                  onClearVideo={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.VIDEO)}
                  onCancel={handleBack}
                />
              )}
            </>
          ) : (
            <>
              {/* View screenshot */}
              {entry.type === PostTypeEnum.SCREENSHOT && mode === 'view' && (
                <PostImageView
                  imageSrc={entry.hashSrc}
                  description={entry.description}
                  onEdit={canEdit ? () => setMode('edit') : undefined}
                  onDelete={onDelete}
                  onVisit={onVisit}
                  onShare={onShare}
                />
              )}

              {/* View video */}
              {entry.type === PostTypeEnum.VIDEO && mode === 'view' && (
                <PostVideoView
                  videoSrc={entry.hashSrc}
                  description={entry.description}
                  onEdit={canEdit ? () => setMode('edit') : undefined}
                  onDelete={onDelete}
                  onVisit={onVisit}
                  onShare={onShare}
                />
              )}

              {/* Edit screenshot */}
              {entry.type === PostTypeEnum.SCREENSHOT && mode === 'edit' && (
                <PostImageForm
                  screenshot={videoOrScreenshot?.file}
                  initialDescription={entry.description}
                  initialScreenshotUrl={entry.hashSrc}
                  isPending={isPending}
                  onMakeScreenshot={onMakeScreenshot}
                  onClearScreenshot={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.SCREENSHOT)}
                  onCancel={() => {
                    handleBack();
                    setMode('view');
                  }}
                />
              )}

              {/* Edit video */}
              {entry.type === PostTypeEnum.VIDEO && mode === 'edit' && (
                <PostVideoForm
                  video={videoOrScreenshot?.file}
                  initialDescription={entry.description}
                  initialVideoUrl={entry.hashSrc}
                  isPending={isPending}
                  isScreenRecording={isScreenRecording}
                  maxVideoDurationSec={MAX_VIDEO_DURATION}
                  onStartRecording={() => onStartRecording(MAX_VIDEO_DURATION)}
                  onStopRecording={onStopRecording}
                  onClearVideo={onClearVideoOrScreenshot}
                  onCreateOrUpdate={(form) => handleCreateOrUpdate(form, PostTypeEnum.VIDEO)}
                  onCancel={() => {
                    handleBack();
                    setMode('view');
                  }}
                />
              )}
            </>
          )}
        </styled.Content>
      </Frame>
    </styled.Wrapper>
  );
};

export default observer(PostEntry);
