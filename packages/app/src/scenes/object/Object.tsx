import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {AssetTypeEnum, PosBusEventEnum} from 'core/enums';

import {ImagePage, ObjectPluginPage, TextPage} from './pages';
import {EmojiAnimationDock} from './components';
import * as styled from './Object.styled';

const Object: FC = () => {
  const {objectStore, universeStore, nftStore, widgetsStore} = useStore();
  const {world3dStore} = universeStore;
  const {asset, assetStore} = objectStore;
  const {assetType} = assetStore;
  const {odysseyInfoStore} = widgetsStore;

  const {objectId} = useParams<{objectId: string}>();

  useEffect(() => {
    objectStore.init(objectId!);
    world3dStore?.triggerInteractionMessage(PosBusEventEnum.EnteredSpace, objectId!, 0, '');

    return () => {
      world3dStore?.triggerInteractionMessage(PosBusEventEnum.LeftSpace, objectId!, 0, '');
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
            {asset?.plugin && (
              <ObjectPluginPage plugin={asset.plugin} pluginLoader={asset} objectId={objectId!} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <styled.Container>
      {renderObject(assetType)}
      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Object);
