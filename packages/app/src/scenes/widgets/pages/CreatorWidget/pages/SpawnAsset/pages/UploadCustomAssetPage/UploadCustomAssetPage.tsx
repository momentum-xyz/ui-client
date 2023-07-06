import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Model3dPreview} from '@momentum-xyz/core3d';
import {
  Button,
  Input,
  Radio,
  ErrorsEnum,
  FileUploader,
  Loader,
  Checkbox,
  IconSvg
} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './UploadCustomAssetPage.styled';

const MAX_ASSET_SIZE = 50_100_000;
const MAX_ASSET_SIZE_MB = `${(MAX_ASSET_SIZE / 1_000_000).toFixed(1)}`;

interface ObjectInfoInterface {
  name: string;
  artistName: string;
  type: 'COMMUNITY' | 'PRIVATE';
  file: File;
  isCustomizable: boolean;
}

const UploadCustomAssetPage: FC = () => {
  const {widgetStore, universeStore} = useStore();
  const {worldId, world3dStore} = universeStore;
  const {creatorStore} = widgetStore;
  const {spawnAssetStore} = creatorStore;

  const [isPreviewShown, setIsPreviewShown] = useState(false);

  const {t} = useI18n();

  const {
    control,
    setError,
    getValues,
    clearErrors,
    handleSubmit,
    formState: {errors, isValid}
  } = useForm<ObjectInfoInterface>({
    defaultValues: {
      type: 'COMMUNITY',
      isCustomizable: false
    }
  });

  const uploadedFile = getValues().file;
  const modelPreviewFilename = useMemo(
    () => (uploadedFile ? URL.createObjectURL(uploadedFile) : ''),
    [uploadedFile]
  );

  const options = [
    {value: 'COMMUNITY', label: 'Available for Community'},
    {value: 'PRIVATE', label: 'Private Asset'}
  ];

  useEffect(() => {
    spawnAssetStore.setUploadedAssetName('');
  }, [spawnAssetStore]);

  const refSnapshotPreview = useRef<string | undefined>();

  const handleSpawnPreview: SubmitHandler<ObjectInfoInterface> = async (form) => {
    const {file, name, type, isCustomizable} = form;
    if (!name || !file) {
      return;
    }

    let preview_hash: string | undefined;
    if (refSnapshotPreview.current) {
      const blob = await (await fetch(refSnapshotPreview.current)).blob();
      console.log('Snapshot blob:', blob);
      preview_hash = await spawnAssetStore.uploadImageToMediaManager(blob as File); // TODO fix type
      console.log('Snapshot uploaded, hash:', preview_hash);
    }

    spawnAssetStore.setUploadedAssetName(name);

    const assetId = await spawnAssetStore.uploadAsset(file, preview_hash, type === 'PRIVATE');
    if (assetId) {
      toast.info(<ToastContent icon="check" text={t('messages.assetUploaded')} />);

      spawnAssetStore.setNavigationObjectName(name);
      spawnAssetStore.setIsCustomizable(isCustomizable);

      if (await spawnAssetStore.spawnPreviewObject(worldId, assetId)) {
        setIsPreviewShown(true);
      }
    } else {
      toast.error(<ToastContent isDanger icon="alert" text={t('messages.assetNotUploaded')} />);
    }
  };

  const handleSpawn = useCallback(() => {
    //spawnAssetStore.setActiveTab('community');
    world3dStore?.setAttachedToCamera(null);
    world3dStore?.closeAndResetObjectMenu();
    spawnAssetStore.selectAsset(null);
  }, [spawnAssetStore, world3dStore]);

  const isUploadReady = spawnAssetStore.isUploadPending;

  return (
    <styled.Container data-testid="UploadCustomAssetPage-test">
      <styled.FormContainer>
        {spawnAssetStore.isUploadPending && (
          <styled.LoaderContainer>
            <Loader />
          </styled.LoaderContainer>
        )}
        <Controller
          name="file"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => {
            // use memoized value to avoid re-rendering
            const filename = modelPreviewFilename;

            return (
              <styled.UploadContainer
                className={cn(!!errors.file && 'error', value && 'has-image')}
              >
                {!value && (
                  <styled.AssetInformation>
                    <h4>{t('messages.uploadAssetInfoTitle')}</h4>
                    <div>{t('messages.uploadAssetDesc1')}</div>
                    <div>{t('messages.uploadAssetDesc2')}</div>
                  </styled.AssetInformation>
                )}
                {!!value && (
                  <styled.PreviewContainer>
                    <Model3dPreview
                      filename={filename}
                      onSnapshot={(dataURL) => {
                        refSnapshotPreview.current = dataURL;
                      }}
                    />
                  </styled.PreviewContainer>
                )}

                {!spawnAssetStore.isUploadPending && (
                  <styled.FileUploaderContainer>
                    <FileUploader
                      fileType="asset"
                      enableDragAndDrop
                      maxSize={MAX_ASSET_SIZE}
                      label={t('actions.uploadYourAsset')}
                      dragActiveLabel={t('actions.dropItHere')}
                      onFilesUpload={(file) => {
                        clearErrors();
                        onChange(file);
                      }}
                      onError={(err) => {
                        console.log('File upload error:', err, err.message);
                        if (err.message === ErrorsEnum.FileSizeTooLarge) {
                          setError('file', {
                            message: t('assetsUploader.errorTooLargeFile', {
                              size: MAX_ASSET_SIZE_MB
                            })
                          });
                          return;
                        }
                        setError('file', {message: t('assetsUploader.errorSave')});
                      }}
                    />
                    {errors.file && <styled.Error>{errors.file.message}</styled.Error>}
                  </styled.FileUploaderContainer>
                )}
              </styled.UploadContainer>
            );
          }}
        />
        <styled.InputsContainer>
          <Controller
            name="name"
            control={control}
            rules={{required: true}}
            render={({field: {value, onChange}}) => (
              <Input
                wide
                value={value}
                disabled={isUploadReady || isPreviewShown}
                placeholder={t('placeholders.nameYourAsset')}
                onChange={onChange}
              />
            )}
          />

          <Controller
            name="artistName"
            control={control}
            render={({field: {value, onChange}}) => (
              <Input
                wide
                value={value}
                disabled={isUploadReady || isPreviewShown}
                placeholder={t('placeholders.nameTheArtist')}
                onChange={onChange}
              />
            )}
          />

          {!isPreviewShown ? (
            <>
              <Controller
                name="isCustomizable"
                control={control}
                render={({field: {value, onChange}}) => (
                  <styled.Radio>
                    <Checkbox
                      value={value}
                      name="isCustomizable"
                      label={t('messages.allowCustomize')}
                      onChange={onChange}
                    />
                  </styled.Radio>
                )}
              />

              <Controller
                name="type"
                control={control}
                render={({field: {value, onChange}}) => (
                  <styled.Radio>
                    <Radio
                      name="type"
                      value={value}
                      options={options}
                      variant="horizontal"
                      onChange={onChange}
                    />
                  </styled.Radio>
                )}
              />
            </>
          ) : (
            <styled.Radio>
              <styled.FlyMessage>
                <IconSvg name="alert" size="m" isWhite />
                <div>{t('messages.flyForSpawning')}</div>
              </styled.FlyMessage>
            </styled.Radio>
          )}
        </styled.InputsContainer>
      </styled.FormContainer>

      <styled.ControlsRow>
        <Button
          variant="secondary"
          label={t('actions.goBack')}
          disabled={isPreviewShown}
          onClick={() => spawnAssetStore.setActiveTab('community')}
        />

        {!isPreviewShown ? (
          <Button
            label={t('actions.preview')}
            disabled={isUploadReady || !isValid}
            onClick={() => handleSubmit(handleSpawnPreview)()}
          />
        ) : (
          <Button
            label={t('actions.spawn')}
            disabled={!spawnAssetStore.navigationObjectName}
            onClick={handleSpawn}
          />
        )}
      </styled.ControlsRow>
    </styled.Container>
  );
};

export default observer(UploadCustomAssetPage);
