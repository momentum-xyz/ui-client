import {useCallback, useMemo} from 'react';
import {FileUploader, ErrorsEnum, ImageSizeEnum, ButtonRound} from '@momentum-xyz/ui-kit';
import {Controller, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
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

type UseAssignImageHookType = (props: {
  objectId: string;
  pluginId?: PluginIdEnum;
  attributeName?: string;
  onChange?: () => void;
}) => {
  content: JSX.Element;
  isModified: boolean;
  save: () => Promise<void>;
  discardChanges: () => void;
  clear: () => Promise<void>;
};

export const useAssignImage: UseAssignImageHookType = ({
  objectId,
  pluginId = PluginIdEnum.IMAGE,
  attributeName = 'state',
  onChange: _OnChange
}) => {
  const {t} = useI18n();

  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: {errors, dirtyFields}
  } = useForm<ImageObjectInterface>();
  console.log('useAssignImage dirtyFields', dirtyFields);

  const [attribute, mediaUploader] = useMemo(() => {
    const attribute = ObjectAttribute.create({
      objectId,
      pluginId,
      attributeName
    });
    attribute.load();
    return [attribute, MediaUploader.create()];
  }, [objectId, pluginId, attributeName]);

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
    (attribute.value as ImageObjectInterface)?.render_hash,
    ImageSizeEnum.S5
  );

  const content = (
    <styled.Container data-testid="AssignImage-test">
      <Controller
        name="image"
        control={control}
        render={({field: {value, onChange}}) => {
          const imageUrl =
            (value && URL.createObjectURL(value)) || (value === null ? value : initialImageSrc);

          const handleChange = (file: File | undefined | null) => {
            onChange(file);
            _OnChange?.();
          };

          return (
            <styled.ImageUploadContainer
              className={cn(!!errors.image && 'error', !!imageUrl && 'has-image')}
            >
              {!!imageUrl && (
                <>
                  <styled.RemoveIcon>
                    <ButtonRound size="normal" icon="bin" onClick={() => handleChange(null)} />
                  </styled.RemoveIcon>
                  <styled.PreviewImageHolder style={{backgroundImage: `url(${imageUrl})`}} />
                </>
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
                  onFilesUpload={handleChange}
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
