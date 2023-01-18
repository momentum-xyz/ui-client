import {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {generatePath, useNavigate, useParams} from 'react-router-dom';

import AssetsGrid from 'scenes/odysseyCreator/pages/SpawnAssetPage/components/AssetsGrid/AssetsGrid';
import {Asset3dCategoryEnum} from 'api/enums';
import {useStore} from 'shared/hooks';
import {Asset3dInterface} from 'core/models';
import {ROUTES} from 'core/constants';

import * as styled from './AssetsPage.styled';

interface PropsInterface {
  assetCategory: Asset3dCategoryEnum;
  setFunctionalityAfterCreation?: boolean;
}

const AssetsPage: FC<PropsInterface> = ({assetCategory, setFunctionalityAfterCreation = false}) => {
  const {odysseyCreatorStore} = useStore();
  const {spawnAssetStore} = odysseyCreatorStore;

  const navigate = useNavigate();

  const {worldId} = useParams<{worldId: string}>();

  useEffect(() => {
    spawnAssetStore.fetchAssets3d(assetCategory);

    return () => {
      spawnAssetStore.clearAssets();
    };
  }, [spawnAssetStore, assetCategory]);

  const handleSelected = useCallback(
    (asset: Asset3dInterface) => {
      spawnAssetStore.selectAsset(asset);
      navigate(
        generatePath(ROUTES.odyssey.creator.spawnAsset.selected, {
          worldId,
          assetCategory
        }),
        {state: {setFunctionalityAfterCreation}}
      );
    },
    [navigate, spawnAssetStore, worldId, assetCategory, setFunctionalityAfterCreation]
  );

  return (
    <styled.Contaier>
      <AssetsGrid assets={spawnAssetStore.assets3d} onSelected={handleSelected} />
    </styled.Contaier>
  );
};

export default observer(AssetsPage);
