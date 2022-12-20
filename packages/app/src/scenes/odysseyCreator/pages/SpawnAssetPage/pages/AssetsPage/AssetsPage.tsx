import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';

import AssetsGrid from 'scenes/odysseyCreator/pages/SpawnAssetPage/components/AssetsGrid/AssetsGrid';
import {Asset3dCategoryEnum} from 'api/enums';
import {useStore} from 'shared/hooks';
import {Asset3dInterface} from 'core/models';
import {ROUTES} from 'core/constants';

import * as styled from './AssetsPage.styled';

interface PropsInterface {
  assetCategory: Asset3dCategoryEnum;
}

const AssetsPage: FC<PropsInterface> = ({assetCategory}) => {
  const {odysseyCreatorStore} = useStore();
  const {odysseyCreatorAssets3dStore} = odysseyCreatorStore;

  const history = useHistory();

  const {worldId} = useParams<{worldId: string}>();

  useEffect(() => {
    odysseyCreatorAssets3dStore.fetchAssets3d(assetCategory);

    return () => {
      odysseyCreatorAssets3dStore.clearAssets();
    };
  }, [odysseyCreatorAssets3dStore, assetCategory]);

  const handleSelected = useCallback(
    (asset: Asset3dInterface) => {
      odysseyCreatorAssets3dStore.selectAsset(asset);
      history.push(
        generatePath(ROUTES.odyssey.creator.spawnAsset.selected, {
          worldId,
          assetCategory
        })
      );
    },
    [history, odysseyCreatorAssets3dStore, worldId, assetCategory]
  );

  return (
    <styled.Contaier>
      <AssetsGrid assets={odysseyCreatorAssets3dStore.assets3d} onSelected={handleSelected} />
    </styled.Contaier>
  );
};

export default observer(AssetsPage);
