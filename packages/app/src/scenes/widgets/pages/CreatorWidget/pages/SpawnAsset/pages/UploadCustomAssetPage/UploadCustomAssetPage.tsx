import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import {toast} from 'react-toastify';
import cn from 'classnames';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {Model3dPreview} from '@momentum-xyz/core3d';
import {Button, Input, Radio, ErrorsEnum, FileUploader} from '@momentum-xyz/ui-kit';
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
}

const UploadCustomAssetPage: FC = () => {
  const {widgetStore} = useStore();
  const {creatorStore} = widgetStore;
  const {spawnAssetStore} = creatorStore;

  const {t} = useI18n();

  const {
    control,
    handleSubmit,
    formState: {errors},
    setError,
    clearErrors
  } = useForm<ObjectInfoInterface>({
    defaultValues: {
      type: 'COMMUNITY'
    }
  });

  const options = [
    {value: 'COMMUNITY', label: 'Available for Community'},
    {value: 'PRIVATE', label: 'Private Asset'}
  ];

  useEffect(() => {
    spawnAssetStore.setUploadedAssetName('');
  }, [spawnAssetStore]);

  const refSnapshotPreview = useRef<string | undefined>();

  const formSubmitHandler: SubmitHandler<ObjectInfoInterface> = async ({file, name, type}) => {
    if (!name || !file) {
      return;
    }
    let preview_hash: string | undefined;
    if (refSnapshotPreview.current) {
      try {
        const blob = await (await fetch(refSnapshotPreview.current)).blob();
        console.log('Snapshot blob:', blob);
        preview_hash = await spawnAssetStore.uploadImageToMediaManager(blob as File); // TODO fix type
        console.log('Snapshot uploaded, hash:', preview_hash);
      } catch (err) {
        console.log('Snapshot upload error:', err, '. Ignore and continue');
      }
    }
    spawnAssetStore.setUploadedAssetName(name);
    if (await spawnAssetStore.uploadAsset(file, preview_hash, type === 'PRIVATE')) {
      toast.info(<ToastContent icon="check" text={t('messages.assetUploaded')} />);
      spawnAssetStore.setActiveTab('community');
    } else {
      toast.error(<ToastContent isDanger icon="alert" text={t('messages.assetNotUploaded')} />);
    }
  };

  const isUploadReady = spawnAssetStore.isUploadPending;

  return (
    <styled.Container data-testid="UploadCustomAssetPage-test">
      <styled.FormContainer>
        <Controller
          name="file"
          control={control}
          rules={{required: true}}
          render={({field: {value, onChange}}) => {
            const filename = value ? URL.createObjectURL(value) : '';
            console.log('UPLOAD ASSET', {value, filename});
            return (
              <styled.UploadContainer
                className={cn(!!errors.file && 'error', value && 'has-image')}
              >
                {!value && (
                  <styled.AssetInformation>
                    <h1>{t('messages.uploadAssetInfoTitle')}</h1>
                    <span>{t('messages.uploadAssetInfoDescription')}</span>
                  </styled.AssetInformation>
                )}
                {!!value && (
                  <styled.PreviewContainer>
                    <Model3dPreview
                      filename={filename}
                      // TODO it should not be necessary, but currently cannot replace already loaded model
                      key={filename}
                      onSnapshot={(dataURL) => {
                        console.log('Snapshot:', dataURL);
                        refSnapshotPreview.current = dataURL;
                      }}
                    />
                  </styled.PreviewContainer>
                )}
                {!spawnAssetStore.isUploadPending && (
                  <styled.FileUploaderContainer>
                    <FileUploader
                      onFilesUpload={(file) => {
                        clearErrors();
                        console.log(file);
                        if (!file || !/\.glb$/i.test(file.name)) {
                          setError('file', {message: t('errors.onlyGLBSupported') || ''});
                          return;
                        }

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
                      label={t('actions.uploadYourAsset')}
                      dragActiveLabel={t('actions.dropItHere')}
                      maxSize={MAX_ASSET_SIZE}
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
                placeholder={'Name your Asset*' || ''}
                value={value}
                wide
                onChange={onChange}
                disabled={isUploadReady}
              />
            )}
          />
          <Controller
            name="artistName"
            control={control}
            render={({field: {value, onChange}}) => (
              <Input
                placeholder={'Name the Artist' || ''}
                value={value}
                wide
                onChange={onChange}
                disabled={isUploadReady}
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({field: {value, onChange}}) => (
              <Radio name="type" value={value} onChange={onChange} options={options} />
            )}
          />
        </styled.InputsContainer>
      </styled.FormContainer>

      <styled.ControlsRow>
        <Button
          label={t('actions.goBack')}
          variant="secondary"
          onClick={() => spawnAssetStore.setActiveTab('community')}
        />
        <Button
          label="Publish"
          disabled={isUploadReady}
          onClick={() => handleSubmit(formSubmitHandler)()}
        />
      </styled.ControlsRow>
    </styled.Container>
  );
};

export default observer(UploadCustomAssetPage);
