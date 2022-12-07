import {observer} from 'mobx-react-lite';
import {FC, useState} from 'react';
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

  const [, setIsVisibleInNavigation] = useState(false);
  const [objectName, setObjectName] = useState('');

  const {assetCategory} = useParams<{
    worldId: string;
    assetCategory: Asset3dCategoryEnum;
  }>();

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
          onChange={setObjectName}
        />
      )}
      <styled.CheckBoxLabel>
        <styled.CheckBox
          type="checkbox"
          onChange={(target) => setIsVisibleInNavigation(target.currentTarget.checked)}
        />
        <Text text="Visible in Navigation" size="m" weight="light" />
      </styled.CheckBoxLabel>
      {assetCategory === Asset3dCategoryEnum.CUSTOM && (
        <styled.NameInput
          placeholder="Name your Object (Navigation)"
          onFocus={() => unityStore.changeKeyboardControl(false)}
          onBlur={() => unityStore.changeKeyboardControl(true)}
          onChange={setObjectName}
        />
      )}
      <Button label="Spawn Object" disabled={!objectName} />
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
