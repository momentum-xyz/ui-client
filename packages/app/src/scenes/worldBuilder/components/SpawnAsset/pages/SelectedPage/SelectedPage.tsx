import {observer} from 'mobx-react-lite';
import {FC, useCallback} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Button, Text} from '@momentum-xyz/ui-kit';

import {Asset3dCategoryEnum} from 'api/enums';
import {useStore} from 'shared/hooks';

import * as styled from './SelectedPage.styled';

export const SelectedPage: FC = () => {
  const {worldBuilderStore, mainStore} = useStore();
  const {worldBuilderAssets3dStore} = worldBuilderStore;
  const {unityStore} = mainStore;

  const {selectedAssset: asset} = worldBuilderAssets3dStore;

  const history = useHistory();

  const {worldId, assetCategory} = useParams<{
    worldId: string;
    assetCategory: Asset3dCategoryEnum;
  }>();

  const handleSpawn = useCallback(() => {
    worldBuilderAssets3dStore.spawnObject(worldId);
  }, [worldBuilderAssets3dStore, worldId]);

  if (!asset) {
    return null;
  }

  return (
    <styled.Container>
      <styled.Image src={asset.image} />
      {assetCategory === Asset3dCategoryEnum.CUSTOM ? (
        <styled.NameLabel text={asset.name} size="m" />
      ) : (
        <styled.NameInput
          placeholder="ObjectName"
          onFocus={() => unityStore.changeKeyboardControl(false)}
          onBlur={() => unityStore.changeKeyboardControl(true)}
          onChange={worldBuilderAssets3dStore.setObjectName}
        />
      )}
      <styled.CheckBoxLabel>
        <styled.CheckBox
          type="checkbox"
          checked={worldBuilderAssets3dStore.isVisibleInNavigation}
          onChange={worldBuilderAssets3dStore.toggleIsVisibleInNavigation}
        />
        <Text text="Visible in Navigation" size="m" weight="light" />
      </styled.CheckBoxLabel>
      <styled.NameInput
        placeholder="Name your Object (Navigation)"
        onFocus={() => unityStore.changeKeyboardControl(false)}
        onBlur={() => unityStore.changeKeyboardControl(true)}
        onChange={worldBuilderAssets3dStore.setNavigationObjectName}
        disabled={!worldBuilderAssets3dStore.isVisibleInNavigation}
      />
      <Button
        label="Spawn Object"
        disabled={
          !worldBuilderAssets3dStore.objectName ||
          (worldBuilderAssets3dStore.isVisibleInNavigation &&
            !worldBuilderAssets3dStore.navigationObjectName)
        }
        onClick={handleSpawn}
      />
      <Button
        label="Go back"
        onClick={() => {
          history.goBack();
        }}
      />
    </styled.Container>
  );
};

export default observer(SelectedPage);
