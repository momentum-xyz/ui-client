import {Button, FileType, FileUploader, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {useStore} from 'shared/hooks';
import {ToastContent} from 'ui-kit';

import * as styled from './UploadCustomAssetPage.styled';

const MAX_ASSET_SIZE = 50_100_000;

const UploadCustomAssetPage: FC = () => {
  const {worldBuilderStore, mainStore} = useStore();
  const {worldBuilderAssets3dStore} = worldBuilderStore;
  const {unityStore} = mainStore;

  const {t} = useTranslation();

  // TODO: Refactor later to useForm
  const [asset, setAsset] = useState<File>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    worldBuilderAssets3dStore.setUploadedAssetName('');
  }, [worldBuilderAssets3dStore]);

  // TODO: refactor later to form handle submit
  const handleAddToLbrary = useCallback(async () => {
    if (asset) {
      await worldBuilderAssets3dStore.uploadAsset(asset);
      toast.info(
        <ToastContent
          headerIconName="check"
          title="success"
          text="Asset uploaded succesfully"
          showCloseButton
        />
      );
    }
  }, [asset, worldBuilderAssets3dStore]);

  return (
    <styled.Container>
      <Text text={t('messages.weSupportGLBModels')} size="m" />
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
          label={t('actions.uploadYourAssset')}
          dragActiveLabel={t('actions.dropItHere')}
          fileType={'' as FileType}
          maxSize={MAX_ASSET_SIZE}
        />
      </styled.FileUploaderContainer>
      {error && <styled.Error>{error}</styled.Error>}
      {asset && (
        <>
          {/* TODO: Implement actual image selecting */}
          <styled.Image src="https://dev.odyssey.ninja/api/v3/render/get/03ce359d18bfc0fe977bd66ab471d222" />
          <styled.NameInput
            placeholder={t('placeholders.nameYourAssetForYourLibrary')}
            onFocus={() => unityStore.changeKeyboardControl(false)}
            onBlur={() => unityStore.changeKeyboardControl(true)}
            onChange={worldBuilderAssets3dStore.setUploadedAssetName}
          />
          <Button
            label={t('actions.addToLibrary')}
            onClick={handleAddToLbrary}
            disabled={!worldBuilderAssets3dStore.uploadedAssetName}
          />
        </>
      )}
    </styled.Container>
  );
};

export default observer(UploadCustomAssetPage);
