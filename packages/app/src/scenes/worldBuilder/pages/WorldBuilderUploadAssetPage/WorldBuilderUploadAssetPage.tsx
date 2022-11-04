import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {Dialog, FileType, FileUploader, Input, Text, ProgressBar} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {CreateSpaceWithAssetRequest} from 'api';

import * as styled from './WorldBuilderUploadAssetPage.styled';

type FormType = Omit<CreateSpaceWithAssetRequest, 'worldId'>;

const MAX_ASSET_SIZE = 50_100_000;

const WorldBuilderUploadAssetPage: FC = () => {
  const {worldBuilderStore, mainStore} = useStore();
  const {worldBuilderAssetsStore} = worldBuilderStore;
  const {uploadAsset, isUploadPending, uploadProgress, uploadAssetDialog} = worldBuilderAssetsStore;

  useEffect(() => {
    return () => worldBuilderAssetsStore.resetModel();
  }, [worldBuilderAssetsStore]);

  const {unityStore} = mainStore;
  const handleSearchFocus = (isFocused: boolean) => {
    unityStore.changeKeyboardControl(!isFocused);
  };

  const theme = useTheme();

  const {t} = useTranslation();

  const {
    control,
    formState: {errors},
    handleSubmit,
    setError,
    clearErrors
  } = useForm<FormType>({
    defaultValues: {
      name: ''
    }
  });
  console.log('errors', errors);

  const formSubmitHandler: SubmitHandler<FormType> = async ({name, asset}) => {
    const isUploadOK = await uploadAsset(name, asset);
    if (!isUploadOK) {
      setError('asset', {
        type: 'submit'
      });
      toast.error(
        <ToastContent
          isDanger
          showCloseButton
          headerIconName="alert"
          text={t('assetsUploader.errorSave')}
        />
      );
      return;
    }

    toast.info(
      <ToastContent
        headerIconName="alert"
        text={t('assetsUploader.successMessage')}
        showCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );

    uploadAssetDialog.close();
  };

  return (
    <Dialog
      title={t('assetsUploader.title')}
      hasBorder
      showCloseButton
      onClose={uploadAssetDialog.close}
      approveInfo={{
        title: t('assetsUploader.confirmButton'),
        onClick: handleSubmit(formSubmitHandler),
        disabled: isUploadPending
      }}
      theme={theme}
    >
      <styled.Container>
        <Controller
          name="name"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <Input
              label={t('assetsUploader.spaceName')}
              type="text"
              value={value}
              onChange={(value) => {
                onChange(value);
              }}
              errorMessage={t('assetsUploader.errorMissingName')}
              isError={!!errors.name}
              disabled={isUploadPending}
              onFocus={() => handleSearchFocus(true)}
              onBlur={() => handleSearchFocus(false)}
            />
          )}
        />
        <Controller
          name="asset"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => (
            <styled.AssetUploadContainer className={cn(!!errors.asset && 'error')}>
              {!!errors.asset?.message && (
                <styled.UploadingError>
                  <Text className="error" text={errors.asset.message} size="m" />
                </styled.UploadingError>
              )}
              {!!value && (
                <styled.FilePreview>
                  <Text text={value.name} size="m" />
                </styled.FilePreview>
              )}
              <FileUploader
                theme={theme}
                label={t('assetsUploader.uploadLabel')}
                dragActiveLabel={t('assetsUploader.dragActiveLabel')}
                onFilesUpload={(file) => {
                  console.log('FILE:', file);
                  if (!file || !/\.glb$/i.test(file.name)) {
                    setError('asset', {
                      message: t('assetsUploader.errorUnsupportedFile')
                    });
                    return;
                  }
                  onChange(file);
                  clearErrors('asset');
                }}
                onError={(err: Error) => {
                  console.log('File upload error:', err);
                  setError('asset', {
                    message:
                      err.message === 'FileSizeTooLarge'
                        ? t('assetsUploader.errorTooLargeFile')
                        : err.message
                  });
                }}
                fileType={'' as FileType} // TODO find out proper type
                maxSize={MAX_ASSET_SIZE}
              />
              {uploadProgress !== null && (
                <styled.UploadProgress>
                  <ProgressBar percent={uploadProgress} />
                </styled.UploadProgress>
              )}
            </styled.AssetUploadContainer>
          )}
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(WorldBuilderUploadAssetPage);
