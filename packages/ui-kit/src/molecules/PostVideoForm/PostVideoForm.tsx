import {FC, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useStopwatch} from 'react-timer-hook';
import {useI18n} from '@momentum-xyz/core';

import {PostFormInterface} from '../../interfaces';
import {ButtonEllipse, IconButton, Input} from '../../atoms';
import {MediaPlayer} from '../index';

import * as styled from './PostVideoForm.styled';

export interface PostVideoFormPropsInterface {
  video?: File;
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
  isPending,
  isScreenRecording,
  maxVideoDurationSec,
  onStartRecording,
  onStopRecording,
  onClearVideo,
  onCreateOrUpdate,
  onCancel
}) => {
  const {control, setValue, formState, handleSubmit} = useForm<PostFormInterface>();
  const {seconds, reset, pause, isRunning} = useStopwatch({autoStart: false});

  const {t} = useI18n();

  useEffect(() => {
    setValue('file', video);
  }, [video, setValue]);

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
          rules={{required: true}}
          render={({field: {value}}) => {
            const videoBlobUrl = value ? URL.createObjectURL(value) : null;
            return (
              <>
                {!videoBlobUrl ? (
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
                ) : (
                  <styled.PreviewVideoContainer>
                    <MediaPlayer sourceUrl={videoBlobUrl} />
                    <styled.Delete>
                      <IconButton name="bin" size="xl" isWhite onClick={handleClear} />
                    </styled.Delete>
                  </styled.PreviewVideoContainer>
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
          disabled={isPending || isScreenRecording || !video}
          onClick={handleCreatePost}
        />
      </styled.FormControls>
    </styled.Container>
  );
};

export default PostVideoForm;
