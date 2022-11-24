import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, FileType, FileUploader, ProgressBar, Text} from '@momentum-xyz/ui-kit';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';
import cn from 'classnames';

import {ToastContent, TOAST_COMMON_OPTIONS} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {UploadAsset3dRequest} from 'api';

import * as styled from './UploadAsset.styled';

type FormType = Omit<UploadAsset3dRequest, 'worldId'>;

const MAX_ASSET_SIZE = 50_100_000;

const UploadAsset: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderAssets3dStore} = worldBuilderStore;
  const {uploadAsset, isUploadPending, uploadProgress, resetUploadProgress} =
    worldBuilderAssets3dStore;

  const theme = useTheme();

  const {t} = useTranslation();

  const {
    control,
    formState: {errors},
    reset: resetForm,
    handleSubmit,
    setError,
    clearErrors
  } = useForm<FormType>();
  console.log('errors', errors);

  const formSubmitHandler: SubmitHandler<FormType> = async ({asset}) => {
    const isUploadOK = await uploadAsset(asset);
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
    resetForm();
    resetUploadProgress();
  };

  return (
    <styled.Container>
      <styled.TitleHolder>
        <Text text="Upload 3D asset" size="l" transform="uppercase" weight="light" />
      </styled.TitleHolder>
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

      <styled.ActionButtonHolder>
        <Button
          label="Upload"
          variant="inverted"
          transform="normal"
          size="medium"
          disabled={isUploadPending}
          onClick={handleSubmit(formSubmitHandler)}
        />
      </styled.ActionButtonHolder>
    </styled.Container>
  );
};

export default observer(UploadAsset);
