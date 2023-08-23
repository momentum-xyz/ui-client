import {FC, useCallback, useEffect, useMemo} from 'react';
import {Frame, Input, FileUploader, ErrorsEnum, Button, ImageSizeEnum} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import cn from 'classnames';

import {ToastContent} from 'ui-kit';
import {ImageObjectInterface} from 'core/interfaces';
import {PluginIdEnum} from 'api/enums';
import {MediaUploader, ObjectAttribute} from 'core/models';
import {getImageAbsoluteUrl} from 'core/utils';

import * as styled from './AssignImage.styled';

const MAX_ASSET_SIZE_MB = 8;
const MAX_ASSET_SIZE_B = MAX_ASSET_SIZE_MB * Math.pow(1024, 2);

interface PropsInterface {
  initialTitle: string | null;
  initialImageSrc: string | null;
  isEditing: boolean;
  isPending: boolean;
  onDelete: () => void;
  onSave: (file: File | undefined, title: string) => void;
  onBack: () => void;
}

const AssignImage: FC<PropsInterface> = ({
  initialTitle,
  initialImageSrc,
  isEditing,
  isPending,
  onDelete,
  onSave,
  onBack
}) => {
  const {t} = useI18n();

  const {
    watch,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<ImageObjectInterface>({});

  useEffect(() => {
    if (initialTitle) {
      setValue('title', initialTitle);
    }
  }, [initialTitle, setValue]);

  const formSubmitHandler: SubmitHandler<ImageObjectInterface> = async (data) => {
    await onSave(data.image, data.title || '');
  };

  const handleUploadError = (err: Error): void => {
    console.log('File upload error:', err);
    const message =
      err.message === ErrorsEnum.FileSizeTooLarge
        ? t('assetsUploader.errorTooLargeFile', {size: MAX_ASSET_SIZE_MB})
        : t('assetsUploader.errorSave');

    toast.error(<ToastContent isDanger icon="alert" text={message} />);
    setError('image', {message: 'upload'});
  };

  const [imageValue] = watch(['image']);

  return (
    <styled.Container data-testid="AssignImage-test">
      <styled.InfoContainer>
        <div>{t('labels.embedPicture')}</div>
        <span>{t('labels.embedPictureInfo')}</span>
      </styled.InfoContainer>
      <styled.Wrapper>
        <Frame>
          <Controller
            name="image"
            control={control}
            render={({field: {value, onChange}}) => {
              const imageUrl = value ? URL.createObjectURL(value) : initialImageSrc;

              return (
                <styled.ImageUploadContainer
                  className={cn(!!errors.image && 'error', !!imageUrl && 'has-image')}
                >
                  {!!imageUrl && (
                    <styled.PreviewImageHolder style={{backgroundImage: `url(${imageUrl})`}} />
                  )}

                  <styled.Uploader>
                    <FileUploader
                      fileType="image"
                      enableDragAndDrop
                      label={t('actions.uploadYourAsset')}
                      dragActiveLabel={t('actions.dropItHere')}
                      maxSize={MAX_ASSET_SIZE_B}
                      onError={handleUploadError}
                      onFilesUpload={onChange}
                    >
                      {!(value || !!initialImageSrc) && (
                        <styled.DragAndDropPrompt>
                          <span>{t('messages.uploadAssetPictureDescription')}</span>
                          <span>{t('labels.or')}</span>
                        </styled.DragAndDropPrompt>
                      )}
                    </FileUploader>
                  </styled.Uploader>
                </styled.ImageUploadContainer>
              );
            }}
          />
        </Frame>

        <styled.InputContainer>
          <Controller
            control={control}
            name="title"
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <Input
                wide
                value={value}
                placeholder={`${t('placeholders.nameYourImage')}*`}
                onChange={onChange}
              />
            )}
          />
        </styled.InputContainer>

        <styled.ActionBar>
          <Button
            variant="secondary"
            label={t('actions.back')}
            disabled={isPending}
            onClick={onBack}
          />

          {isEditing && (
            <Button
              variant="secondary"
              label={t('actions.delete')}
              disabled={isPending}
              onClick={onDelete}
            />
          )}

          <Button
            label={isEditing ? t('actions.save') : t('actions.embed')}
            disabled={!isValid || (!imageValue && !initialImageSrc) || isPending}
            onClick={() => handleSubmit(formSubmitHandler)()}
          />
        </styled.ActionBar>
      </styled.Wrapper>
    </styled.Container>
  );
};

export const useAssignImage = ({
  objectId
}: {
  objectId: string;
}): {
  content: JSX.Element;
  isModified: boolean;
  save: () => Promise<void>;
  discardChanges: () => void;
  clear: () => Promise<void>;
} => {
  const {t} = useI18n();

  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: {errors, dirtyFields}
  } = useForm<ImageObjectInterface>();

  const [attribute, mediaUploader] = useMemo(() => {
    const attribute = ObjectAttribute.create({
      objectId,
      pluginId: PluginIdEnum.IMAGE
    });
    attribute.load();
    return [attribute, MediaUploader.create()];
  }, [objectId]);

  const save = useCallback(async () => {
    await handleSubmit(async (data) => {
      let render_hash: string | null = null;

      if (data.image) {
        render_hash = await mediaUploader.uploadImageOrVideo(data.image);
        if (!render_hash) {
          console.log('ObjectAttribute image: upload error');
          setError('image', {message: 'upload'});
          return;
        }
      }

      await attribute.set({
        render_hash
      });
    })();
  }, [attribute, handleSubmit, mediaUploader, setError]);

  const clear = useCallback(async () => {
    await attribute.delete();
  }, [attribute]);

  const handleUploadError = (err: Error): void => {
    console.log('File upload error:', err);
    const message =
      err.message === ErrorsEnum.FileSizeTooLarge
        ? t('assetsUploader.errorTooLargeFile', {size: MAX_ASSET_SIZE_MB})
        : t('assetsUploader.errorSave');

    toast.error(<ToastContent isDanger icon="alert" text={message} />);
    setError('image', {message});
  };

  const initialImageSrc = getImageAbsoluteUrl(
    attribute.valueAs<ImageObjectInterface>()?.render_hash,
    ImageSizeEnum.S5
  );

  const content = (
    <styled.Container data-testid="AssignImage-test">
      <Controller
        name="image"
        control={control}
        render={({field: {value, onChange}}) => {
          const imageUrl = value ? URL.createObjectURL(value) : initialImageSrc;

          return (
            <styled.ImageUploadContainer
              className={cn(!!errors.image && 'error', !!imageUrl && 'has-image')}
            >
              {!!imageUrl && (
                <styled.PreviewImageHolder style={{backgroundImage: `url(${imageUrl})`}} />
              )}
              {errors.image && (
                <styled.Error>{errors.image.message || t('assetsUploader.errorSave')}</styled.Error>
              )}

              <styled.Uploader>
                <FileUploader
                  fileType="image"
                  enableDragAndDrop
                  label={t('actions.uploadYourAsset')}
                  dragActiveLabel={t('actions.dropItHere')}
                  maxSize={MAX_ASSET_SIZE_B}
                  onError={handleUploadError}
                  onFilesUpload={onChange}
                >
                  {!value && (
                    <styled.DragAndDropPrompt>
                      <span>{t('messages.uploadAssetPictureDescription')}</span>
                      <span>{t('labels.or')}</span>
                    </styled.DragAndDropPrompt>
                  )}
                </FileUploader>
              </styled.Uploader>
            </styled.ImageUploadContainer>
          );
        }}
      />
    </styled.Container>
  );

  return {
    content,
    isModified: Object.keys(dirtyFields).length > 0,
    save,
    discardChanges: reset,
    clear
  };
};

export default observer(AssignImage);
