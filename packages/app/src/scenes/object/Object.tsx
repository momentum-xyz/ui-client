import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EmojiAnimationDock} from 'scenes/collaboration/components';
import {AssetTypeEnum, PosBusEventEnum} from 'core/enums';

import * as styled from './Object.styled';
import {ObjectPluginPage} from './pages';

const Object: FC = () => {
  const rootStore = useStore();
  const {objectStore, mainStore} = rootStore;
  const {unityStore} = mainStore;
  const {asset} = objectStore;

  const {objectId, assetType} = useParams<{objectId: string; assetType: AssetTypeEnum}>();

  useEffect(() => {
    rootStore.openObject(objectId, assetType);
    unityStore.triggerInteractionMessage(PosBusEventEnum.EnteredSpace, objectId, 0, '');

    return () => {
      unityStore.triggerInteractionMessage(PosBusEventEnum.LeftSpace, objectId, 0, '');
      objectStore.resetModel();
    };
  }, [rootStore, objectId, assetType, unityStore, objectStore]);

  return (
    <styled.Container>
      {asset?.plugin && (
        <ObjectPluginPage plugin={asset.plugin} pluginLoader={asset} objectId={objectId} />
      )}
      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Object);
