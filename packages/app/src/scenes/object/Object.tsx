import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EmojiAnimationDock} from 'scenes/collaboration/components';
import {AssetTypeEnum, PosBusEventEnum} from 'core/enums';

import {ImagePage, ObjectPluginPage, TextPage, VideoPage} from './pages';
import * as styled from './Object.styled';
import {ProfilePage} from './pages/ProfilePage';

const Object: FC = () => {
  const rootStore = useStore();
  const {objectStore, mainStore} = rootStore;
  const {unityStore} = mainStore;
  const {asset, assetStore} = objectStore;
  const {assetType} = assetStore;

  const {objectId} = useParams<{objectId: string}>();

  useEffect(() => {
    rootStore.openObject(objectId);
    unityStore.triggerInteractionMessage(PosBusEventEnum.EnteredSpace, objectId, 0, '');

    return () => {
      unityStore.triggerInteractionMessage(PosBusEventEnum.LeftSpace, objectId, 0, '');
      objectStore.resetModel();
    };
  }, [objectId, objectStore, rootStore, unityStore]);

  const renderObject = (assetType?: string) => {
    switch (assetType) {
      case AssetTypeEnum.TEXT:
        return <TextPage />;
      case AssetTypeEnum.IMAGE:
        return (
          <>
            <ImagePage />
          </>
        );
      case AssetTypeEnum.VIDEO:
        return <VideoPage />;
      case AssetTypeEnum.PLUGIN:
        return (
          <>
            {asset?.plugin && (
              <ObjectPluginPage plugin={asset.plugin} pluginLoader={asset} objectId={objectId} />
            )}
          </>
        );
      case AssetTypeEnum.DOCK:
        return <ProfilePage />;
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
