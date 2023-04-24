import {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {Button, Input, TabInterface, Tabs} from '@momentum-xyz/ui-kit-storybook';

import {useStore} from 'shared/hooks';
// import {Asset3dCategoryEnum} from 'api/enums';

import * as styled from './ObjectInspectorPage.styled';
// import {AssignFunction} from './pages';

type TabType = 'community' | 'private' | 'upload' | 'selected';

const TABS_LIST: TabInterface<TabType>[] = [
  {id: 'community', icon: 'rabbit_fill', label: i18n.t('labels.communityObjectLibrary')},
  {id: 'private', icon: 'astronaut', label: i18n.t('labels.privateObjectLibrary')}
];

const ObjectInspector: FC = () => {
  const {odysseyCreatorStore, universeStore} = useStore();
  const {spawnAssetStore} = odysseyCreatorStore;
  const {setActiveTab, activeTab, selectedAsset} = spawnAssetStore;
  const worldId = universeStore.worldId;

  console.log('ObjectInspector.tsx: selected asset: ', selectedAsset);

  const {t} = useI18n();

  //needs to be called before the first render
  useMemo(() => {
    spawnAssetStore.init(worldId);
  }, [spawnAssetStore, worldId]);

  return (
    <styled.Container>
      <styled.Header>
        <Tabs tabList={TABS_LIST} activeId={activeTab} onSelect={setActiveTab} />
        <Input
          placeholder={t('labels.search')}
          isSearch
          isClearable
          wide
          onChange={spawnAssetStore.searchQuery.setQuery}
          value={spawnAssetStore.searchQuery.query}
        />
        <Button
          label={t('labels.uploadCustomObject')}
          wide
          icon="astro"
          onClick={() => setActiveTab('upload')}
        />
      </styled.Header>
      <styled.Separator />
      <styled.Body>
        {/* {selectedAsset ? (
          <SelectedPage />
        ) : (
          <>
            {activeTab === 'community' && (
              <AssetsPage assetCategory={Asset3dCategoryEnum.CUSTOM} showPreview />
            )}
            {activeTab === 'private' && (
              <AssetsPage assetCategory={Asset3dCategoryEnum.STANDARD} showPreview />
            )}
            {activeTab === 'upload' && <UploadCustomAssetPage />}
          </>
        )} */}
      </styled.Body>
    </styled.Container>
  );
};

export default observer(ObjectInspector);
