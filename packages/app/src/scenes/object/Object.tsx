import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EmojiAnimationDock} from 'scenes/collaboration/components';
import {AssetTypeEnum, PosBusEventEnum} from 'core/enums';

import {ImagePage, ObjectPluginPage, TextPage, VideoPage} from './pages';
import * as styled from './Object.styled';

const Object: FC = () => {
  const rootStore = useStore();
  const {objectStore, mainStore} = rootStore;
  const {unityStore} = mainStore;
  const {asset, tileStore} = objectStore;
  const {assetType, imageSrc, content} = tileStore;

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
        return <TextPage content={content} />;
      case AssetTypeEnum.IMAGE:
        return <>{imageSrc && <ImagePage content={content} imageSrc={imageSrc} />}</>;
      case AssetTypeEnum.VIDEO:
        return <VideoPage content={content} />;
      case AssetTypeEnum.PLUGIN:
        return (
          <>
            {asset?.plugin && (
              <ObjectPluginPage plugin={asset.plugin} pluginLoader={asset} objectId={objectId} />
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
