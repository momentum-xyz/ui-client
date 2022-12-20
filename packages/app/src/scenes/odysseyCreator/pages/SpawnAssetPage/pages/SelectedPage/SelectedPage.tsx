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
  const {odysseyCreatorAssets3dStore} = odysseyCreatorStore;
  const {unityStore} = mainStore;

  const {selectedAssset: asset} = odysseyCreatorAssets3dStore;

  const history = useHistory();

  const {t} = useTranslation();

  const {worldId} = useParams<{
    worldId: string;
  }>();

  useEffect(() => {
    return () => {
      odysseyCreatorAssets3dStore.resetSelectedObjectFields();
    };
  }, [odysseyCreatorAssets3dStore]);

  const handleSpawn = useCallback(() => {
    odysseyCreatorAssets3dStore.spawnObject(worldId);
    history.push(generatePath(ROUTES.odyssey.base, {worldId}));
  }, [history, odysseyCreatorAssets3dStore, worldId]);

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
          checked={odysseyCreatorAssets3dStore.isVisibleInNavigation}
          onChange={odysseyCreatorAssets3dStore.toggleIsVisibleInNavigation}
        />
        <Text text={t('labels.visibleInNavigation')} size="m" weight="light" />
      </styled.CheckBoxLabel>
      <styled.NameInput
        placeholder={t('placeholders.nameYourObjectNavigation')}
        onFocus={() => unityStore.changeKeyboardControl(false)}
        onBlur={() => unityStore.changeKeyboardControl(true)}
        onChange={odysseyCreatorAssets3dStore.setNavigationObjectName}
      />
      <Button
        label={t('actions.spawnObject')}
        disabled={!odysseyCreatorAssets3dStore.navigationObjectName}
        onClick={handleSpawn}
      />
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
