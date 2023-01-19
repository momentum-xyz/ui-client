import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EmojiAnimationDock} from 'scenes/collaboration/components';
import {AssetTypeEnum, PosBusEventEnum} from 'core/enums';

import {ImagePage, ObjectPluginPage, TextPage, VideoPage} from './pages';
import * as styled from './Object.styled';

const Object: FC = () => {
  const {objectStore, unityStore, nftStore, widgetsStore} = useStore();
  const {unityInstanceStore} = unityStore;
  const {asset, assetStore} = objectStore;
  const {assetType} = assetStore;
  const {odysseyInfoStore} = widgetsStore;

  const {objectId} = useParams<{objectId: string}>();

  useEffect(() => {
    objectStore.init(objectId!);
    unityInstanceStore.triggerInteractionMessage(PosBusEventEnum.EnteredSpace, objectId!, 0, '');

    return () => {
      unityInstanceStore.triggerInteractionMessage(PosBusEventEnum.LeftSpace, objectId!, 0, '');
      objectStore.resetModel();
    };
  }, [objectId, objectStore, unityInstanceStore]);

  useEffect(() => {
    if (assetType === AssetTypeEnum.DOCK) {
      if (assetStore.dockWorldId) {
        const nft = nftStore.getNftByUuid(assetStore.dockWorldId);
        odysseyInfoStore.open(nft);
      }
    }
  }, [assetStore.dockWorldId, assetType, nftStore, odysseyInfoStore]);

  const renderObject = (assetType?: string) => {
    switch (assetType) {
      case AssetTypeEnum.TEXT:
        return <TextPage />;
      case AssetTypeEnum.IMAGE:
        return <ImagePage />;
      case AssetTypeEnum.VIDEO:
        return <VideoPage />;
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
