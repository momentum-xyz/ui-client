import {FC, useEffect, useCallback} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';

import {Asset3dCategoryEnum} from 'api/enums';
import {useStore} from 'shared/hooks';
import {AssetGrid} from 'scenes/worldBuilder/components/SpawnAsset/components';
import {ROUTES} from 'core/constants';
import {Asset3dInterface} from 'core/models';

import * as styled from './CustomAssetsLibraryPage.styled';

const CustomAssetsLibraryPage: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderAssets3dStore} = worldBuilderStore;

  const history = useHistory();

  const {worldId} = useParams<{worldId: string}>();

  useEffect(() => {
    worldBuilderAssets3dStore.fetchAssets3d(Asset3dCategoryEnum.CUSTOM);

    return () => {
      worldBuilderAssets3dStore.clearAssets();
    };
  }, [worldBuilderAssets3dStore]);

  const handleSelected = useCallback(
    (asset: Asset3dInterface) => {
      worldBuilderAssets3dStore.selectAsset(asset);
      history.push(
        generatePath(ROUTES.odyssey.builder.spawnAsset.selected, {
          worldId,
          assetCategory: Asset3dCategoryEnum.CUSTOM
        })
      );
    },
    [history, worldBuilderAssets3dStore, worldId]
  );

  return (
    <styled.Contaier>
      <AssetGrid assets={worldBuilderAssets3dStore.assets3d} onSelected={handleSelected} />
    </styled.Contaier>
  );
};

export default observer(CustomAssetsLibraryPage);
