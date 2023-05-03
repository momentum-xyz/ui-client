import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {Panel, TabInterface, Tabs} from '@momentum-xyz/ui-kit-storybook';

import {useNavigation, useStore} from 'shared/hooks';
import {AssetTypeEnum, BasicAsset2dIdEnum} from 'core/enums';

import {ImagePage, ObjectPluginPage, TextPage} from './pages';
import {EmojiAnimationDock} from './components';
import * as styled from './Object.styled';

const TABS_LIST: TabInterface<BasicAsset2dIdEnum>[] = [
  {id: BasicAsset2dIdEnum.IMAGE, icon: 'picture_upload', label: 'Picture'},
  {id: BasicAsset2dIdEnum.VIDEO, icon: 'video_upload', label: 'Video'},
  {id: BasicAsset2dIdEnum.TEXT, icon: 'upload', label: 'Text'}
];

const Object: FC = () => {
  const {objectStore, universeStore, nftStore, widgetsStore} = useStore();
  const {world3dStore} = universeStore;
  const {pluginLoader, assetStore, currentAssetId} = objectStore;
  const {assetType} = assetStore;
  const {odysseyInfoStore} = widgetsStore;

  const {objectId} = useParams<{objectId: string}>();
  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    objectStore.init(objectId);

    return () => {
      objectStore.resetModel();
    };
  }, [objectId, objectStore, world3dStore]);

  useEffect(() => {
    if (assetType === AssetTypeEnum.DOCK) {
      if (assetStore.dockWorldId) {
        odysseyInfoStore.open(assetStore.dockWorldId);
      }
    }
  }, [assetStore.dockWorldId, assetType, nftStore, odysseyInfoStore]);

  const renderObject = (assetType?: string) => {
    switch (assetType) {
      case AssetTypeEnum.TEXT:
        return <TextPage />;
      case AssetTypeEnum.IMAGE:
        return <ImagePage />;
      case AssetTypeEnum.PLUGIN:
        return (
          <>
            {pluginLoader?.plugin && (
              <ObjectPluginPage
                plugin={pluginLoader.plugin}
                pluginLoader={pluginLoader}
                objectId={objectId}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  console.log('objectStore.objectName', objectStore.objectName, {
    assetType,
    currentAssetId
  });

  if (!currentAssetId) {
    return null;
  }

  return (
    <styled.Container data-testid="Object-test">
      <Panel
        isFullHeight
        size="large"
        icon="document"
        variant="primary"
        title={objectStore.objectName || ''}
        onClose={() => goToOdysseyHome()}
      >
        <styled.Tabs>
          <Tabs tabList={TABS_LIST} activeId={currentAssetId} />
        </styled.Tabs>

        {renderObject(assetType)}
      </Panel>
      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Object);
