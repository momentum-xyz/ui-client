import {FC, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useStopwatch} from 'react-timer-hook';
import {useI18n} from '@momentum-xyz/core';

import {PostFormInterface} from '../../../../interfaces';
import {ButtonEllipse, IconButton, Input} from '../../../../atoms';
import {MediaPlayer} from '../../../../molecules';

import * as styled from './VideoPostForm.styled';

interface PropsInterface {
  video?: File;
  isCreating?: boolean;
  maxVideoDurationSec: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCreatePost: (form: PostFormInterface) => void;
  onCancel: () => void;
}

const VideoPostForm: FC<PropsInterface> = ({
  video,
  isCreating,
  maxVideoDurationSec,
  onStartRecording,
  onStopRecording,
  onCreatePost,
  onCancel
}) => {
  const {control, setValue, formState, handleSubmit} = useForm<PostFormInterface>();
  const {seconds, reset, pause, isRunning} = useStopwatch({autoStart: false});

  const {t} = useI18n();

  useEffect(() => {
    setValue('file', video);
  }, [video, setValue]);

  const handleCreatePost = handleSubmit(async (data: PostFormInterface) => {
    await onCreatePost({...data});
  });

  const handleStartRecording = () => {
    onStartRecording();
    reset();
  };

  const handleStopRecording = () => {
    onStopRecording();
    pause();
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
    <styled.Container data-testid="VideoPostForm-test">
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
                        {!isRunning ? (
                          <>{t('messages.startRecording')}</>
                        ) : (
                          <>{t('messages.recording')}...</>
                        )}
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
                  <MediaPlayer sourceUrl={videoBlobUrl} />
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
              disabled={isCreating}
            />
          )}
        />
      </styled.Inputs>

      <styled.FormControls>
        <ButtonEllipse icon="chevron_left" label={t('actions.back')} onClick={handleCancel} />

        <ButtonEllipse
          icon="add"
          label={t('actions.addToTimeline')}
          disabled={isCreating || !video}
          onClick={handleCreatePost}
        />
      </styled.FormControls>
    </styled.Container>
  );
};

export default VideoPostForm;
