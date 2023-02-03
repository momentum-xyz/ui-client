import {Button, ErrorsEnum, FileType, FileUploader, Text} from '@momentum-xyz/ui-kit';
import {Model3dPreview} from '@momentum-xyz/map3d';
import {observer} from 'mobx-react-lite';
import {FC, useCallback, useState, useEffect, useRef, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './UploadCustomAssetPage.styled';

const MAX_ASSET_SIZE = 50_100_000;
const MAX_ASSET_SIZE_MB = `${(MAX_ASSET_SIZE / 1_000_000).toFixed(1)}`;

const UploadCustomAssetPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {spawnAssetStore} = odysseyCreatorStore;
  const {unityInstanceStore} = unityStore;

  const {t} = useTranslation();

  // TODO: Refactor later to useForm
  const [asset, setAsset] = useState<File>();
  const [error, setError] = useState<string>();

  // createObjectURL returns different URL for the same file each time it's called
  const filename = useMemo(() => (asset ? URL.createObjectURL(asset) : null), [asset]);

  useEffect(() => {
    spawnAssetStore.setUploadedAssetName('');
  }, [spawnAssetStore]);

  const refSnapshotPreview = useRef<string | undefined>();

  // TODO: refactor later to form handle submit
  const handleAddToLbrary = useCallback(async () => {
    if (asset) {
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

      await spawnAssetStore.uploadAsset(asset, preview_hash);

      toast.info(
        <ToastContent
          headerIconName="check"
          title={t('titles.success')}
          text={t('messages.assetUploadedSuccesfully')}
          showCloseButton
        />
      );
    }
  }, [asset, spawnAssetStore, t]);

  return (
    <styled.Container>
      <Text text={t('messages.weSupportGLBModels')} size="m" />
      <Text text={t('messages.glbModelsMaxSize', {size: MAX_ASSET_SIZE_MB})} size="m" />
      <styled.FileUploaderContainer>
        <FileUploader
          onFilesUpload={(file) => {
            setError(undefined);
            console.log(file);
            if (!file || !/\.glb$/i.test(file.name)) {
              setError(t('errors.onlyGLBSupported'));
              return;
            }

            setAsset(file);
          }}
          onError={(err) => {
            console.log('File upload error:', err, err.message);
            if (err.message === ErrorsEnum.FileSizeTooLarge) {
              setError(t('assetsUploader.errorTooLargeFile', {size: MAX_ASSET_SIZE_MB}));
            } else {
              setError(t('assetsUploader.errorSave'));
            }
          }}
          label={t('actions.uploadYourAssset')}
          dragActiveLabel={t('actions.dropItHere')}
          fileType={'' as FileType}
          maxSize={MAX_ASSET_SIZE}
        />
      </styled.FileUploaderContainer>
      {error && <styled.Error>{error}</styled.Error>}
      {asset && filename && (
        <>
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
          <styled.NameInput
            placeholder={t('placeholders.nameYourAssetForYourLibrary')}
            onFocus={() => unityInstanceStore.changeKeyboardControl(false)}
            onBlur={() => unityInstanceStore.changeKeyboardControl(true)}
            onChange={spawnAssetStore.setUploadedAssetName}
          />
          <Button
            label={t('actions.addToLibrary')}
            onClick={handleAddToLbrary}
            disabled={!spawnAssetStore.uploadedAssetName || !!error}
          />
        </>
      )}
    </styled.Container>
  );
};

export default observer(UploadCustomAssetPage);
