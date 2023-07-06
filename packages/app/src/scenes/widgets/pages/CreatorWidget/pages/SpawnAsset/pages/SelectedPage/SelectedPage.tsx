import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect, useState} from 'react';
import {Button, Checkbox, IconSvg, Input} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';
import {Model3dPreview} from '@momentum-xyz/core3d';

import {useStore} from 'shared/hooks';

import * as styled from './SelectedPage.styled';

export const SelectedPage: FC = () => {
  const {widgetStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {spawnAssetStore} = creatorStore;
  const {selectedAsset} = spawnAssetStore;
  const {worldId, world3dStore} = universeStore;

  const [assetInfo, setAssetInfo] = useState<any | null>(null);
  const [isPreviewShown, setIsPreviewShown] = useState(false);

  const {t} = useI18n();

  useEffect(() => {
    spawnAssetStore.setNavigationObjectName(selectedAsset?.name || '');
    return () => {
      spawnAssetStore.resetSelectedObjectFields();
    };
  }, [selectedAsset, spawnAssetStore]);

  const handleSpawnPreview = useCallback(async () => {
    if (await spawnAssetStore.spawnPreviewObject(worldId)) {
      setIsPreviewShown(true);
    }
  }, [spawnAssetStore, worldId]);

  const handleSpawn = useCallback(() => {
    world3dStore?.setAttachedToCamera(null);
    spawnAssetStore.selectAsset(null);
  }, [spawnAssetStore, world3dStore]);

  const handleSnapshot = async (dataURL: string, initialSnapshot: boolean) => {
    if (!selectedAsset || !!selectedAsset.preview_hash || !initialSnapshot) {
      return;
    }

    try {
      const blob = await (await fetch(dataURL)).blob();
      const preview_hash = await spawnAssetStore.uploadImageToMediaManager(blob as File); // TODO fix type
      console.log('preview_hash', preview_hash);
      await spawnAssetStore.patchAssetMetadata(selectedAsset.id, {preview_hash});
      console.log('Silently set model preview_hash for', selectedAsset);
    } catch (err) {
      console.log('Error silently setting preview_hash', err, {
        selectedAsset,
        dataURL,
        initialSnapshot
      });
    }
  };

  const handleGoBack = () => {
    spawnAssetStore.selectAsset(null);
  };

  if (!selectedAsset) {
    return null;
  }

  console.log(selectedAsset);
  console.log('assetInfo', assetInfo);

  return (
    <styled.Container data-testid="SelectedPage-test">
      <styled.ObjectInfoContainer>
        <styled.PreviewContainer>
          <Model3dPreview
            filename={selectedAsset.thumbnailAssetDownloadUrl}
            previewUrl={selectedAsset.previewUrl}
            onSnapshot={selectedAsset.category === 'custom' ? handleSnapshot : undefined}
            onAssetInfoLoaded={setAssetInfo}
          />
        </styled.PreviewContainer>

        {assetInfo?.extras?.author && (
          <styled.Row>
            <styled.Prop>
              <styled.PropName>Created by:</styled.PropName>
              <styled.PropValue>{assetInfo?.extras?.author}</styled.PropValue>
            </styled.Prop>
          </styled.Row>
        )}

        <Input
          wide
          disabled={isPreviewShown}
          placeholder={t('placeholders.defaultAssetName')}
          value={spawnAssetStore.navigationObjectName}
          onChange={spawnAssetStore.setNavigationObjectName}
        />

        {!isPreviewShown ? (
          <styled.Radio>
            <Checkbox
              name="isCustomizable"
              value={spawnAssetStore.isCustomizable}
              label={t('messages.allowCustomize')}
              onChange={spawnAssetStore.setIsCustomizable}
            />
          </styled.Radio>
        ) : (
          <styled.Radio>
            <styled.FlyMessage>
              <IconSvg name="alert" size="m" isWhite />
              <div>{t('messages.flyForSpawning')}</div>
            </styled.FlyMessage>
          </styled.Radio>
        )}
      </styled.ObjectInfoContainer>

      <styled.ControlsRow>
        <Button
          variant="secondary"
          label={t('actions.goBack')}
          disabled={isPreviewShown}
          onClick={handleGoBack}
        />

        {!isPreviewShown ? (
          <Button
            label={t('actions.preview')}
            disabled={!spawnAssetStore.navigationObjectName}
            onClick={handleSpawnPreview}
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

export default observer(SelectedPage);
