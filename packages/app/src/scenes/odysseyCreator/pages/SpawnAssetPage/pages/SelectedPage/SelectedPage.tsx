import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect} from 'react';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {Button, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';

import * as styled from './SelectedPage.styled';

export const SelectedPage: FC = () => {
  const {odysseyCreatorStore, mainStore} = useStore();
  const {spawnAssetStore} = odysseyCreatorStore;
  const {unityStore} = mainStore;

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
    spawnAssetStore.spawnObject(worldId);
    history.push(generatePath(ROUTES.odyssey.base, {worldId}));
  }, [history, spawnAssetStore, worldId]);

  const handleRemoveFromLibrary = useCallback(() => {
    if (!asset) {
      return;
    }

    spawnAssetStore.removeAsset(asset.id);
    history.goBack();
  }, [asset, history, spawnAssetStore]);

  if (!asset) {
    return null;
  }

  return (
    <styled.Container>
      <styled.Image src={asset.image} />
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
        onFocus={() => unityStore.changeKeyboardControl(false)}
        onBlur={() => unityStore.changeKeyboardControl(true)}
        onChange={spawnAssetStore.setNavigationObjectName}
      />
      <styled.AssetActions>
        <Button
          label={t('actions.spawnObject')}
          disabled={!spawnAssetStore.navigationObjectName}
          onClick={handleSpawn}
        />
        <Button
          label={t('actions.removeFromLibrary')}
          variant="danger"
          onClick={handleRemoveFromLibrary}
        />
      </styled.AssetActions>
      <Button
        label={t('actions.goBack')}
        onClick={() => {
          history.goBack();
        }}
      />
    </styled.Container>
  );
};

export default observer(SelectedPage);
