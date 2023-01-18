import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect} from 'react';
import {generatePath, useNavigate, useParams} from 'react-router-dom';
import {Button, Text} from '@momentum-xyz/ui-kit';
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

  const navigate = useNavigate();

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
          navigate(generatePath(ROUTES.odyssey.creator.functionality, {worldId, objectId}));
        } else {
          navigate(generatePath(ROUTES.odyssey.base, {worldId}));
        }
      }
    });
  }, [navigate, spawnAssetStore, worldId]);

  if (!asset) {
    return null;
  }

  return (
    <styled.Container>
      <styled.PreviewContainer>
        <Model3dPreview filename={asset.thumbnailAssetDownloadUrl} />
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
          navigate(-1);
        }}
      />
    </styled.Container>
  );
};

export default observer(SelectedPage);
