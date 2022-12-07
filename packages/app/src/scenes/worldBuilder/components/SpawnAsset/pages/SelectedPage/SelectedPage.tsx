import {observer} from 'mobx-react-lite';
import {FC} from 'react';
import {useParams} from 'react-router-dom';

import {Asset3dCategoryEnum} from 'api/enums';
import {useStore} from 'shared/hooks';

import * as styled from './SelectedPage.styled';

export const SelectedPage: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderAssets3dStore} = worldBuilderStore;

  const {worldId, assetCategory} = useParams<{
    worldId: string;
    assetCategory: Asset3dCategoryEnum;
  }>();

  // TODO: Implement correctly
  return (
    <styled.Container>
      <h1>
        {assetCategory} + {worldId}
      </h1>
      <p>{worldBuilderAssets3dStore.selectedAssset?.name}</p>
    </styled.Container>
  );
};

export default observer(SelectedPage);
