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
  assetPageHeader?: string;
}

const AssetsPage: FC<PropsInterface> = ({
  assetCategory,
  // TODO remove?
  setFunctionalityAfterCreation = false,
  showPreview,
  assetPageHeader
}) => {
  const {creatorStore} = useStore();
  const {spawnAssetStore} = creatorStore;

  const assetList = spawnAssetStore.filteredAsset3dList(assetCategory);

  useEffect(() => {
    spawnAssetStore.fetchAssets3d(assetCategory);
    return () => spawnAssetStore.clearAssets();
  }, [spawnAssetStore, assetCategory]);

  return (
    <styled.Container>
      {assetPageHeader && (
        <styled.Header>
          <span>{assetPageHeader}</span>
          <span>{assetList.length}</span>
        </styled.Header>
      )}
      <styled.GridContainer>
        <AssetsGrid
          assets={assetList}
          showPreview={showPreview}
          onSelected={spawnAssetStore.selectAsset}
        />
      </styled.GridContainer>
    </styled.Container>
  );
};

export default observer(AssetsPage);
