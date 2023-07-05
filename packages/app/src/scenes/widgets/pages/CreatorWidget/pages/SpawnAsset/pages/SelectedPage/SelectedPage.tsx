import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect, useState} from 'react';
import {Button, Input} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {Model3dPreview} from '@momentum-xyz/core3d';

import {useStore} from 'shared/hooks';

import * as styled from './SelectedPage.styled';

export const SelectedPage: FC = () => {
  const {widgetStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {spawnAssetStore} = creatorStore;
  const {worldId} = universeStore;

  const {selectedAsset: asset, selectAsset} = spawnAssetStore;

  const {t} = useI18n();

  const [assetInfo, setAssetInfo] = useState<any | null>(null);

  useEffect(() => {
    spawnAssetStore.setNavigationObjectName(asset?.name || '');
    return () => {
      spawnAssetStore.resetSelectedObjectFields();
    };
  }, [asset, spawnAssetStore]);

  const handleSpawn = useCallback(() => {
    spawnAssetStore.spawnObject(worldId).then((objectId) => {
      console.log('Spawned object', objectId);
    });
  }, [spawnAssetStore, worldId]);

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

  // const handleDevUpload = (file: File | undefined) => {
  //   console.log({file, asset});
  //   if (asset && file) {
  //     spawnAssetStore
  //       .uploadImageToMediaManager(file)
  //       .then((imageHash) => {
  //         alert(
  //           `UPDATE asset_3d SET meta = jsonb_set(meta, '{preview_hash}', '"${imageHash}"', TRUE) WHERE asset_3d_id = '${asset.id}';`
  //         );
  //       })
  //       .catch((err) => {
  //         alert(err);
  //       });
  //   }
  // };

  const handleGoBack = () => {
    selectAsset(null);
  };

  if (!asset) {
    return null;
  }

  return (
    <styled.Container data-testid="SelectedPage-test">
      <styled.ObjectInfoContainer>
        <styled.PreviewContainer>
          <Model3dPreview
            filename={asset.thumbnailAssetDownloadUrl}
            previewUrl={asset.previewUrl}
            onSnapshot={asset.category === 'custom' ? handleSnapshot : undefined}
            onAssetInfoLoaded={setAssetInfo}
          />
        </styled.PreviewContainer>

        <styled.ObjectTitle>{asset.name}</styled.ObjectTitle>

        {assetInfo?.extras?.author && (
          <styled.Row>
            <styled.Prop>
              <styled.PropName>Created by:</styled.PropName>
              <styled.PropValue>{assetInfo?.extras?.author}</styled.PropValue>
            </styled.Prop>
          </styled.Row>
        )}

        <styled.Row>
          <styled.Prop>
            <styled.PropName>Change name:</styled.PropName>
            <Input
              placeholder={t('placeholders.defaultAssetName')}
              value={spawnAssetStore.navigationObjectName}
              onChange={spawnAssetStore.setNavigationObjectName}
            />
          </styled.Prop>
        </styled.Row>
      </styled.ObjectInfoContainer>

      <styled.ControlsRow>
        <Button label={t('actions.goBack')} variant="secondary" onClick={handleGoBack} />
        <Button
          label={t('actions.spawnObject')}
          disabled={!spawnAssetStore.navigationObjectName}
          onClick={handleSpawn}
        />
      </styled.ControlsRow>
    </styled.Container>
  );
};

export default observer(SelectedPage);
