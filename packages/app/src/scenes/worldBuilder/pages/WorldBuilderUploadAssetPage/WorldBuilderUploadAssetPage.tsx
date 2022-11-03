import {FC} from 'react';
import {observer} from 'mobx-react-lite';
// import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {
  Dialog,
  FileType,
  FileUploader,
  Input,
  Text
  // Loader
} from '@momentum-xyz/ui-kit';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import {ToastContent} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {CreateSpaceWithAssetRequest} from 'api';

import * as styled from './WorldBuilderUploadAssetPage.styled';

type FormType = Omit<CreateSpaceWithAssetRequest, 'worldId'>;

const MAX_ASSET_SIZE = 50_100_000;

const WorldBuilderUploadAssetPage: FC = () => {
  const {worldBuilderStore, mainStore} = useStore();
  const {worldBuilderAssetsStore} = worldBuilderStore;
  const {uploadAsset, isUploadPending, uploadAssetDialog} = worldBuilderAssetsStore;

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
    setError
  } = useForm<FormType>({
    defaultValues: {
      name: ''
    }
  });

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
                  onChange(file || null);
                }}
                onError={(err) => {
                  console.log('File upload error:', err);
                  setError('asset', {message: 'upload'});
                }}
                fileType={'' as FileType} // TODO find out proper type
                maxSize={MAX_ASSET_SIZE}
              />
            </styled.AssetUploadContainer>
          )}
        />
      </styled.Container>
    </Dialog>
  );
};

export default observer(WorldBuilderUploadAssetPage);
