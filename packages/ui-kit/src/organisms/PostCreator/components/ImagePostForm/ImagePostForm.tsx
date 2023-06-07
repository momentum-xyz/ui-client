import {FC, useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';

import {PostFormInterface} from '../../../../interfaces';
import {ButtonEllipse, IconButton, Input} from '../../../../atoms';

import * as styled from './ImagePostForm.styled';

interface PropsInterface {
  screenshot?: File;
  isCreating?: boolean;
  onMakeScreenshot: () => void;
  onClearScreenshot: () => void;
  onCreatePost: (form: PostFormInterface) => void;
  onCancel: () => void;
}

const ImagePostForm: FC<PropsInterface> = ({
  screenshot,
  isCreating,
  onMakeScreenshot,
  onClearScreenshot,
  onCreatePost,
  onCancel
}) => {
  const {control, setValue, formState, handleSubmit} = useForm<PostFormInterface>();
  const {t} = useI18n();

  useEffect(() => {
    setValue('file', screenshot);
  }, [screenshot, setValue]);

  const handleCreatePost = handleSubmit(async (data: PostFormInterface) => {
    await onCreatePost({...data});
  });

  return (
    <styled.Container data-testid="ImagePostForm-test">
      <styled.Inputs>
        {/* Screenshot */}
        <Controller
          name="file"
          control={control}
          rules={{required: true}}
          render={({field: {value}}) => (
            <>
              {value ? (
                <styled.PreviewImageContainer url={URL.createObjectURL(value)}>
                  <styled.Actions>
                    <span>{t('messages.takeShot')}</span>
                    <IconButton name="record_two" size="xxl" isWhite onClick={onMakeScreenshot} />
                  </styled.Actions>
                  <styled.Delete>
                    <IconButton name="bin" size="xl" isWhite onClick={onClearScreenshot} />
                  </styled.Delete>
                </styled.PreviewImageContainer>
              ) : (
                <styled.EmptyContainer>
                  <styled.Actions>
                    <span>{t('messages.takeSnapshot')}</span>
                    <IconButton name="photo_camera" size="xxl" isWhite onClick={onMakeScreenshot} />
                  </styled.Actions>
                </styled.EmptyContainer>
              )}
            </>
          )}
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
        <ButtonEllipse icon="chevron_left" label={t('actions.back')} onClick={onCancel} />

        <ButtonEllipse
          icon="add"
          label={t('actions.addToTimeline')}
          disabled={isCreating || !screenshot}
          onClick={handleCreatePost}
        />
      </styled.FormControls>
    </styled.Container>
  );
};

export default ImagePostForm;
