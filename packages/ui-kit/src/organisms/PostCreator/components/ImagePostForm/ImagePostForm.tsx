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
  onCreatePost: (form: PostFormInterface) => void;
  onCancel: () => void;
}

const ImagePostForm: FC<PropsInterface> = ({
  screenshot,
  isCreating,
  onMakeScreenshot,
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
          render={({field: {value, onChange}}) => (
            <>
              {!value ? (
                <styled.EmptyContainer>
                  <styled.Actions>
                    <span>{t('messages.takeSnapshot')}</span>
                    <IconButton name="photo_camera" size="xxl" isWhite onClick={onMakeScreenshot} />
                  </styled.Actions>
                </styled.EmptyContainer>
              ) : (
                <div>image</div>
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
          disabled={!formState.isValid || isCreating}
          onClick={handleCreatePost}
        />
      </styled.FormControls>
    </styled.Container>
  );
};

export default ImagePostForm;