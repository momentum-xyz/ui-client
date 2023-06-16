import {FC, useEffect, useMemo, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';

import {PostHeading} from '../../molecules';
import {ButtonEllipse, Frame, IconButton, Input} from '../../atoms';
import {PostAuthorInterface, PostEntryInterface, PostFormInterface} from '../../interfaces';

import * as styled from './PostImageForm.styled';

export interface PostImageFormPropsInterface {
  author: PostAuthorInterface;
  entry?: PostEntryInterface;
  screenshot?: File | null;
  isPending?: boolean;
  onMakeScreenshot: () => void;
  onClearScreenshot: () => void;
  onCreateOrUpdate: (form: PostFormInterface) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const PostImageForm: FC<PostImageFormPropsInterface> = ({
  author,
  entry,
  screenshot,
  isPending,
  onMakeScreenshot,
  onClearScreenshot,
  onCreateOrUpdate,
  onDelete,
  onCancel
}) => {
  const [imageWasDeleted, setImageWasDeleted] = useState(false);
  const {control, setValue, formState, handleSubmit} = useForm<PostFormInterface>();
  const {t} = useI18n();

  const isNewPost = !entry;

  useEffect(() => {
    setValue('file', screenshot || undefined);
    if (screenshot) {
      setImageWasDeleted(true);
    }
  }, [screenshot, setValue]);

  useEffect(() => {
    setValue('description', entry?.description || '');
  }, [entry?.description, setValue]);

  const submitIsDisabled = useMemo(() => {
    if (isNewPost) {
      return isPending || !screenshot;
    } else {
      return isPending || (imageWasDeleted && !screenshot);
    }
  }, [imageWasDeleted, isNewPost, isPending, screenshot]);

  const handleDeleteImage = () => {
    onClearScreenshot();
    setImageWasDeleted(true);
  };

  const handleMakeScreenshot = () => {
    onMakeScreenshot();
  };

  const handleCreatePost = handleSubmit(async (data: PostFormInterface) => {
    await onCreateOrUpdate({...data});
  });

  return (
    <styled.Container data-testid="PostImageForm-test">
      <Frame>
        <PostHeading author={author} entry={entry} />

        <styled.Inputs>
          {/* Screenshot */}
          <Controller
            name="file"
            control={control}
            render={({field: {value}}) => {
              const imageUrl = value ? URL.createObjectURL(value) : null;
              const initialUrl = !imageWasDeleted ? entry?.hashSrc : null;

              return (
                <>
                  {imageUrl || initialUrl ? (
                    <styled.PreviewImageContainer url={imageUrl || initialUrl || ''}>
                      <styled.Actions>
                        <span>{t('messages.takeShot')}</span>
                        <IconButton
                          name="record_two"
                          size="xxl"
                          isWhite
                          onClick={handleMakeScreenshot}
                        />
                      </styled.Actions>
                      <styled.Delete>
                        <IconButton name="bin" size="xl" isWhite onClick={handleDeleteImage} />
                      </styled.Delete>
                    </styled.PreviewImageContainer>
                  ) : (
                    <styled.EmptyContainer>
                      <styled.Actions>
                        <span>{t('messages.takeSnapshot')}</span>
                        <IconButton
                          name="photo_camera"
                          size="xxl"
                          isWhite
                          onClick={onMakeScreenshot}
                        />
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
          <ButtonEllipse icon="chevron_left" label={t('actions.back')} onClick={onCancel} />

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

export default PostImageForm;
