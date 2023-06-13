import {FC, useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useStopwatch} from 'react-timer-hook';
import {useI18n} from '@momentum-xyz/core';

import {PostFormInterface} from '../../../../interfaces';
import {ButtonEllipse, IconButton, Input} from '../../../../atoms';
import {MediaPlayer} from '../../../../molecules';

import * as styled from './PostVideoForm.styled';

export interface PostVideoFormPropsInterface {
  video?: File;
  initialVideoUrl?: string | null;
  initialDescription?: string | null;
  isPending?: boolean;
  isScreenRecording?: boolean;
  maxVideoDurationSec: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onClearVideo: () => void;
  onCreateOrUpdate: (form: PostFormInterface) => void;
  onCancel: () => void;
}

const PostVideoForm: FC<PostVideoFormPropsInterface> = ({
  video,
  initialVideoUrl,
  initialDescription,
  isPending,
  isScreenRecording,
  maxVideoDurationSec,
  onStartRecording,
  onStopRecording,
  onClearVideo,
  onCreateOrUpdate,
  onCancel
}) => {
  const [videoWasDeleted, setVideoWasDeleted] = useState(false);
  const {control, setValue, formState, handleSubmit} = useForm<PostFormInterface>();
  const {seconds, reset, pause, isRunning} = useStopwatch({autoStart: false});

  const {t} = useI18n();

  useEffect(() => {
    setValue('file', video);
    if (video) {
      setVideoWasDeleted(true);
    }
  }, [video, setValue]);

  useEffect(() => {
    setValue('description', initialDescription || '');
  }, [initialDescription, setValue]);

  const submitIsDisabled = useMemo(() => {
    if (!initialVideoUrl) {
      return isPending || isScreenRecording || !video;
    } else {
      return isPending || isScreenRecording || (videoWasDeleted && !video);
    }
  }, [initialVideoUrl, isPending, isScreenRecording, video, videoWasDeleted]);

  const handleCreatePost = handleSubmit(async (data: PostFormInterface) => {
    await onCreateOrUpdate({...data});
  });

  const handleStartRecording = () => {
    onStartRecording();
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
    if (isRunning && seconds >= maxVideoDurationSec) {
      onStopRecording();
      pause();
    }
  }, [isRunning, maxVideoDurationSec, onStopRecording, pause, seconds]);

  return (
    <styled.Container data-testid="PostVideoForm-test">
      <styled.Inputs>
        {/* Video */}
        <Controller
          name="file"
          control={control}
          render={({field: {value}}) => {
            const videoUrl = value ? URL.createObjectURL(value) : null;
            const initialUrl = !videoWasDeleted ? initialVideoUrl : null;

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

        <ButtonEllipse
          icon="add"
          label={t('actions.addToTimeline')}
          disabled={submitIsDisabled}
          onClick={handleCreatePost}
        />
      </styled.FormControls>
    </styled.Container>
  );
};

export default PostVideoForm;
