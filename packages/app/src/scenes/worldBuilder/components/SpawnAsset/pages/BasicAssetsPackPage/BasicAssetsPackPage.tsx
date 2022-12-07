import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';

import {Asset3dCategoryEnum} from 'api/enums';
import {useStore} from 'shared/hooks';
import AssetsGrid from 'scenes/worldBuilder/components/SpawnAsset/components/AssetsGrid/AssetsGrid';
import {Asset3dInterface} from 'core/models';
import {ROUTES} from 'core/constants';

import * as styled from './BasicAssetsPackPage.styled';

const BasicAssetsPackPage: FC = () => {
  const {worldBuilderStore} = useStore();
  const {worldBuilderAssets3dStore} = worldBuilderStore;

  const history = useHistory();

  const {worldId} = useParams<{worldId: string}>();

  useEffect(() => {
    worldBuilderAssets3dStore.fetchAssets3d(Asset3dCategoryEnum.BASIC);

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
          assetCategory: Asset3dCategoryEnum.BASIC
        })
      );
    },
    [history, worldBuilderAssets3dStore, worldId]
  );

  return (
    <styled.Contaier>
      <AssetsGrid assets={worldBuilderAssets3dStore.assets3d} onSelected={handleSelected} />
    </styled.Contaier>
  );
};

export default observer(BasicAssetsPackPage);
