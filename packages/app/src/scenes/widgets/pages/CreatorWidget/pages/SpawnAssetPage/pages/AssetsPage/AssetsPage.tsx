import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import AssetsGrid from 'scenes/widgets/pages/CreatorWidget/pages/SpawnAssetPage/components/AssetsGrid/AssetsGrid';
import {Asset3dCategoryEnum} from 'api/enums';
import {useStore} from 'shared/hooks';

import * as styled from './AssetsPage.styled';

interface PropsInterface {
  assetCategory: Asset3dCategoryEnum;
  showPreview?: boolean;
  setFunctionalityAfterCreation?: boolean;
}

const AssetsPage: FC<PropsInterface> = ({
  assetCategory,
  // TODO remove?
  setFunctionalityAfterCreation = false,
  showPreview
}) => {
  const {creatorStore} = useStore();
  const {spawnAssetStore} = creatorStore;

  useEffect(() => {
    spawnAssetStore.fetchAssets3d(assetCategory);

    return () => {
      spawnAssetStore.clearAssets();
    };
  }, [spawnAssetStore, assetCategory]);

  return (
    <styled.Contaier>
      <AssetsGrid
        assets={spawnAssetStore.filteredAsset3dList(assetCategory)}
        showPreview={showPreview}
        onSelected={spawnAssetStore.selectAsset}
      />
    </styled.Contaier>
  );
};

export default observer(AssetsPage);
