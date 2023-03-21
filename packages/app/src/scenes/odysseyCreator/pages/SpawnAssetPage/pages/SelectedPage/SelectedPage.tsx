import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect} from 'react';
import {generatePath, useNavigate, useParams} from 'react-router-dom';
import {Button, FileUploader, Text} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {Model3dPreview} from '@momentum-xyz/map3d';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import * as styled from './SelectedPage.styled';

export const SelectedPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {spawnAssetStore} = odysseyCreatorStore;
  const {unityInstanceStore} = unityStore;

  const {selectedAssset: asset} = spawnAssetStore;

  const navigate = useNavigate();

  const {t} = useI18n();

  const {worldId} = useParams<{
    worldId: string;
  }>();

  useEffect(() => {
    return () => {
      spawnAssetStore.resetSelectedObjectFields();
    };
  }, [spawnAssetStore]);

  const handleSpawn = useCallback(() => {
    spawnAssetStore.spawnObject(worldId!).then((objectId) => {
      if (objectId) {
        if (window.history.state?.state?.setFunctionalityAfterCreation) {
          navigate(generatePath(ROUTES.odyssey.creator.functionality, {worldId, objectId}));
        } else {
          navigate(generatePath(ROUTES.odyssey.base, {worldId}));
        }
      }
    });
  }, [navigate, spawnAssetStore, worldId]);

  const handleSnapshot = async (dataURL: string, initialSnapshot: boolean) => {
    if (!asset || !!asset.preview_hash || !initialSnapshot) {
      return;
    }

    try {
      const blob = await (await fetch(dataURL)).blob();
      const preview_hash = await spawnAssetStore.uploadImageToMediaManager(blob as File); // TODO fix type
      console.log('preview_hash', preview_hash);
      await spawnAssetStore.patchAssetMetadata(asset.id, {preview_hash});
      console.log('Silently set model preview_hash for', asset);
    } catch (err) {
      console.log('Error silently setting preview_hash', err, {asset, dataURL, initialSnapshot});
    }
  };

  const handleDevUpload = (file: File | undefined) => {
    console.log({file, asset});
    if (asset && file) {
      spawnAssetStore
        .uploadImageToMediaManager(file)
        .then((imageHash) => {
          alert(
            `UPDATE asset_3d SET meta = jsonb_set(meta, '{preview_hash}', '"${imageHash}"', TRUE) WHERE asset_3d_id = '${asset.id}';`
          );
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  if (!asset) {
    return null;
  }

  return (
    <styled.Container>
      <styled.PreviewContainer>
        <Model3dPreview
          filename={asset.thumbnailAssetDownloadUrl}
          previewUrl={asset.previewUrl}
          onSnapshot={asset.category === 'custom' ? handleSnapshot : undefined}
        />
      </styled.PreviewContainer>
      <styled.NameLabel text={asset.name} size="m" />
      <styled.CheckBoxLabel>
        <styled.CheckBox
          type="checkbox"
          checked={spawnAssetStore.isVisibleInNavigation}
          onChange={spawnAssetStore.toggleIsVisibleInNavigation}
        />
        <Text text={t('labels.visibleInNavigation')} size="m" weight="light" />
      </styled.CheckBoxLabel>
      <styled.NameInput
        placeholder={t('placeholders.nameYourObjectNavigation') || ''}
        onFocus={() => unityInstanceStore.changeKeyboardControl(false)}
        onBlur={() => unityInstanceStore.changeKeyboardControl(true)}
        onChange={spawnAssetStore.setNavigationObjectName}
      />
      <Button
        label={t('actions.spawnObject')}
        disabled={!spawnAssetStore.navigationObjectName}
        onClick={handleSpawn}
      />
      <Button
        label={t('actions.goBack')}
        onClick={() => {
          navigate(-1);
        }}
      />
      {process.env.NODE_ENV === 'development' && (
        <FileUploader
          label="DEV - Upload PREVIEW Image"
          dragActiveLabel="Drop the files here..."
          fileType="image"
          buttonSize="small"
          onFilesUpload={handleDevUpload}
          onError={(error) => console.error(error)}
          enableDragAndDrop={false}
        />
      )}
    </styled.Container>
  );
};

export default observer(SelectedPage);
