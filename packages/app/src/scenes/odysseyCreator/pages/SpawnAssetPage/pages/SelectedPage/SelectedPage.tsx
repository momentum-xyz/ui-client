import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect} from 'react';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {Button, FileUploader, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';
import {Model3dPreview} from '@momentum-xyz/map3d';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import * as styled from './SelectedPage.styled';

export const SelectedPage: FC = () => {
  const {odysseyCreatorStore, unityStore} = useStore();
  const {spawnAssetStore} = odysseyCreatorStore;
  const {unityInstanceStore} = unityStore;

  const {selectedAssset: asset} = spawnAssetStore;

  const history = useHistory();

  const {t} = useTranslation();

  const {worldId} = useParams<{
    worldId: string;
  }>();

  useEffect(() => {
    return () => {
      spawnAssetStore.resetSelectedObjectFields();
    };
  }, [spawnAssetStore]);

  const handleSpawn = useCallback(() => {
    spawnAssetStore.spawnObject(worldId).then((objectId) => {
      if (objectId) {
        if (window.history.state?.state?.setFunctionalityAfterCreation) {
          history.push(generatePath(ROUTES.odyssey.creator.functionality, {worldId, objectId}));
        } else {
          history.push(generatePath(ROUTES.odyssey.base, {worldId}));
        }
      }
    });
  }, [history, spawnAssetStore, worldId]);

  const handleDevUpload = (file: File | undefined) => {
    console.log({file, asset});
    if (asset && file) {
      spawnAssetStore
        .devUploadImage(file)
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
          // TODO take snapshow, ask confirmation to replace original
          // check asset type "custom" to determine whether to do it
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
        placeholder={t('placeholders.nameYourObjectNavigation')}
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
          history.goBack();
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
