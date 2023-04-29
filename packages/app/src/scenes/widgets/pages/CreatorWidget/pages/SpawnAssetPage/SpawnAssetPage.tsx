import {FC, useMemo} from 'react';
import {observer} from 'mobx-react-lite';
import {useI18n, i18n} from '@momentum-xyz/core';
import {Frame, Button, Input, TabInterface} from '@momentum-xyz/ui-kit-storybook';
import {Text} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {Asset3dCategoryEnum} from 'api/enums';

import * as styled from './SpawnAssetPage.styled';
import {UploadCustomAssetPage, AssetsPage, SelectedPage} from './pages';

type TabType = 'community' | 'private' | 'upload' | 'selected';

const TABS_LIST: TabInterface<TabType>[] = [
  {id: 'community', icon: 'rabbit_fill', label: i18n.t('labels.communityObjectLibrary')},
  {id: 'private', icon: 'astronaut', label: i18n.t('labels.privateObjectLibrary')}
];

const SpawnAssetPage: FC = () => {
  const {creatorStore, universeStore} = useStore();
  const {spawnAssetStore} = creatorStore;
  const {setActiveTab, activeTab, selectedAsset, selectAsset} = spawnAssetStore;
  const worldId = universeStore.worldId;

  const {t} = useI18n();

  //needs to be called before the first render
  useMemo(() => {
    spawnAssetStore.init(worldId);
  }, [spawnAssetStore, worldId]);

  const handleTabSelect = (tabId: TabType) => {
    setActiveTab(tabId);
    selectAsset(null);
  };

  return (
    <styled.Container>
      <styled.ControlsContainer>
        <Frame>
          <styled.ControlsInnerContainer>
            <styled.SkyboxTypeContainer>
              {TABS_LIST.map((tab) => (
                <Button
                  key={tab.id}
                  label={tab.label}
                  active={activeTab === tab.id}
                  onClick={() => handleTabSelect(tab.id)}
                />
              ))}
            </styled.SkyboxTypeContainer>
            <styled.SkyboxSearchContainer>
              <Input
                placeholder={t(
                  `placeholders.${
                    activeTab === 'community' ? 'searchCommunityLibrary' : 'searchPrivateLibrary'
                  }`
                )}
                value={spawnAssetStore.searchQuery.query}
                isSearch
                onChange={spawnAssetStore.searchQuery.setQuery}
                wide
              />
            </styled.SkyboxSearchContainer>
            <Button
              label={t('labels.uploadCustomObject')}
              wide
              icon="astro"
              onClick={() => setActiveTab('upload')}
            />
          </styled.ControlsInnerContainer>
        </Frame>
        <styled.Separator />
      </styled.ControlsContainer>
      {/* <styled.Header>
        <Tabs tabList={TABS_LIST} activeId={activeTab as TabType} onSelect={handleTabSelect} />
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
      </styled.Header> */}
      <styled.Body>
        {selectedAsset ? (
          <SelectedPage />
        ) : (
          <>
            {activeTab === 'community' && (
              <styled.AssetsGroupList>
                {/* <Text text={t('labels.wrappableAssetPack')} size="l" transform="uppercase" /> */}
                <AssetsPage
                  assetCategory={Asset3dCategoryEnum.BASIC}
                  showPreview
                  assetPageHeader={t('labels.wrappableAssetPack')}
                />
                {/* <Text text={t('labels.communityAssetPack')} size="l" transform="uppercase" /> */}
                <AssetsPage
                  assetCategory={Asset3dCategoryEnum.CUSTOM}
                  showPreview
                  assetPageHeader={t('labels.communityAssetPack')}
                />
              </styled.AssetsGroupList>
            )}
            {activeTab === 'private' && <Text text="Coming soon!" size="l" />}
            {activeTab === 'upload' && <UploadCustomAssetPage />}
          </>
        )}
      </styled.Body>
    </styled.Container>
  );
};

export default observer(SpawnAssetPage);
