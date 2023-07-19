import {FC, useEffect} from 'react';
import {Frame, Input, FileUploader, ErrorsEnum, Button} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useI18n} from '@momentum-xyz/core';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import cn from 'classnames';

import {ToastContent} from 'ui-kit';
import {ImageObjectInterface} from 'core/interfaces';

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
            label={isEditing ? t('actions.edit') : t('actions.embed')}
            disabled={!isValid || (!imageValue && !initialImageSrc) || isPending}
            onClick={() => handleSubmit(formSubmitHandler)()}
          />
        </styled.ActionBar>
      </styled.Wrapper>
    </styled.Container>
  );
};

export default observer(AssignImage);
