import {FC, useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useStopwatch} from 'react-timer-hook';
import {useI18n} from '@momentum-xyz/core';

import {PostAuthorInterface, PostEntryInterface, PostFormInterface} from '../../interfaces';
import {ButtonEllipse, Frame, IconButton, Input} from '../../atoms';
import {MediaPlayer, PostHeading} from '../../molecules';

import * as styled from './PostVideoForm.styled';

export interface PostVideoFormPropsInterface {
  author: PostAuthorInterface;
  entry?: PostEntryInterface;
  video?: File;
  isPending?: boolean;
  isScreenRecording?: boolean;
  onStartRecording: (maxDuration: number) => void;
  onStopRecording: () => void;
  onClearVideo: () => void;
  onCreateOrUpdate: (form: PostFormInterface) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const MAX_VIDEO_DURATION = 15;

const PostVideoForm: FC<PostVideoFormPropsInterface> = ({
  author,
  entry,
  video,
  isPending,
  isScreenRecording,
  onStartRecording,
  onStopRecording,
  onClearVideo,
  onCreateOrUpdate,
  onDelete,
  onCancel
}) => {
  const [videoWasDeleted, setVideoWasDeleted] = useState(false);
  const {control, setValue, formState, handleSubmit} = useForm<PostFormInterface>();
  const {seconds, reset, pause, isRunning} = useStopwatch({autoStart: false});

  const isNewPost = !entry;

  const {t} = useI18n();

  useEffect(() => {
    setValue('file', video);
    if (video) {
      setVideoWasDeleted(true);
    }
  }, [video, setValue]);

  useEffect(() => {
    setValue('description', entry?.description || '');
  }, [entry?.description, setValue]);

  const submitIsDisabled = useMemo(() => {
    if (isNewPost) {
      return isPending || isScreenRecording || !video;
    } else {
      return isPending || isScreenRecording || (videoWasDeleted && !video);
    }
  }, [isNewPost, isPending, isScreenRecording, video, videoWasDeleted]);

  const handleCreatePost = handleSubmit(async (data: PostFormInterface) => {
    await onCreateOrUpdate({...data});
  });

  const handleStartRecording = () => {
    onStartRecording(MAX_VIDEO_DURATION);
    reset();
  };

  const handleStopRecording = () => {
    onStopRecording();
    pause();
  };

  const handleClear = () => {
    onClearVideo();
    setVideoWasDeleted(true);
    reset(undefined, false);
  };

  const handleCancel = () => {
    if (isRunning) {
      handleStopRecording();
    }
    onCancel();
  };

  useEffect(() => {
    if (isRunning && seconds >= MAX_VIDEO_DURATION) {
      onStopRecording();
      pause();
    }
  }, [isRunning, onStopRecording, pause, seconds]);

  return (
    <styled.Container data-testid="PostVideoForm-test">
      <Frame>
        <PostHeading author={author} entry={entry} />

        <styled.Inputs>
          {/* Video */}
          <Controller
            name="file"
            control={control}
            render={({field: {value}}) => {
              const videoUrl = value ? URL.createObjectURL(value) : null;
              const initialUrl = !videoWasDeleted ? entry?.hashSrc : null;

              return (
                <>
                  {videoUrl || initialUrl ? (
                    <styled.PreviewVideoContainer>
                      <MediaPlayer sourceUrl={videoUrl || initialUrl || ''} />
                      <styled.Delete>
                        <IconButton name="bin" size="xl" isWhite onClick={handleClear} />
                      </styled.Delete>
                    </styled.PreviewVideoContainer>
                  ) : (
                    <styled.EmptyContainer>
                      <styled.Actions>
                        <styled.Message>
                          {!isRunning && <>{t('messages.startRecording')}</>}
                        </styled.Message>

                        {!isRunning ? (
                          <IconButton
                            name="record"
                            size="xxl"
                            isWhite
                            onClick={handleStartRecording}
                          />
                        ) : (
                          <IconButton name="record_stop" size="xxl" onClick={handleStopRecording} />
                        )}

                        <styled.Timer>
                          00:{seconds < 10 ? <>{`0${seconds}`}</> : <>{seconds}</>}
                        </styled.Timer>
                      </styled.Actions>
                    </styled.EmptyContainer>
                  )}
                </>
              );
            }}
          />

          {/* DESCRIPTION */}
          <Controller
            name="description"
            control={control}
            render={({field: {value, onChange}}) => (
              <Input
                wide
                value={value}
                onChange={onChange}
                placeholder={t('fields.addDescription')}
                danger={!!formState.errors.description}
                disabled={isPending}
              />
            )}
          />
        </styled.Inputs>

        <styled.FormControls>
          <ButtonEllipse
            icon="chevron_left"
            label={t('actions.back')}
            disabled={isScreenRecording}
            onClick={handleCancel}
          />

          <styled.FormControlsGroup>
            {!isNewPost && (
              <ButtonEllipse icon="bin" label={t('actions.delete')} onClick={onDelete} />
            )}

            <ButtonEllipse
              icon={isNewPost ? 'add' : 'checked'}
              label={isNewPost ? t('actions.addToTimeline') : t('actions.publish')}
              disabled={submitIsDisabled}
              onClick={handleCreatePost}
            />
          </styled.FormControlsGroup>
        </styled.FormControls>
      </Frame>
    </styled.Container>
  );
};

export default PostVideoForm;
