import React, {FC, useEffect} from 'react';
import {generatePath, Route, Switch, useHistory, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EmojiAnimationDock} from 'scenes/collaboration/components';
import {PosBusEventEnum} from 'core/enums';
import {ROUTES} from 'core/constants';

import {ObjectPluginPage, TextPage, VideoPage, ImagePage} from './pages';
import * as styled from './Object.styled';

const Object: FC = () => {
  const rootStore = useStore();
  const {objectStore, mainStore} = rootStore;
  const {unityStore} = mainStore;
  const {asset, tileStore} = objectStore;
  const {assetType, content, imageSrc, youtubeUrl} = tileStore;
  const history = useHistory();

  const {objectId} = useParams<{objectId: string}>();

  useEffect(() => {
    rootStore.openObject(objectId);
    unityStore.triggerInteractionMessage(PosBusEventEnum.EnteredSpace, objectId, 0, '');

    return () => {
      unityStore.triggerInteractionMessage(PosBusEventEnum.LeftSpace, objectId, 0, '');
      objectStore.resetModel();
    };
  }, [history, objectId, objectStore, rootStore, unityStore]);

  useEffect(() => {
    if (assetType) {
      history.push(generatePath(ROUTES.object.base, {objectId, assetType}));
    }
  }, [assetType, history, objectId]);
  return (
    <styled.Container>
      <Switch>
        <Route path={generatePath(ROUTES.object.base, {objectId, assetType: 'plugin'})}>
          {asset?.plugin && (
            <ObjectPluginPage plugin={asset.plugin} pluginLoader={asset} objectId={objectId} />
          )}
        </Route>
        <Route path={generatePath(ROUTES.object.base, {objectId, assetType: 'text'})}>
          <TextPage content={content} />
        </Route>
        <Route path={generatePath(ROUTES.object.base, {objectId, assetType: 'image'})}>
          {imageSrc && <ImagePage content={content} imageSrc={imageSrc} />}
        </Route>
        <Route path={generatePath(ROUTES.object.base, {objectId, assetType: 'video'})}>
          {youtubeUrl && <VideoPage content={content} youtubeUrl={youtubeUrl} />}
        </Route>
      </Switch>
      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Object);
