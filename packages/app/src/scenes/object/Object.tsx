import React, {FC, useEffect} from 'react';
import {generatePath, Route, Switch, useHistory, useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {EmojiAnimationDock} from 'scenes/collaboration/components';
import {PosBusEventEnum} from 'core/enums';
import {ROUTES} from 'core/constants';

import * as styled from './Object.styled';
import {ObjectPluginPage} from './pages';

const Object: FC = () => {
  const rootStore = useStore();
  const {objectStore, mainStore} = rootStore;
  const {unityStore} = mainStore;
  const {pluginAsset: asset} = objectStore;

  const history = useHistory();

  const {objectId} = useParams<{objectId: string}>();

  useEffect(() => {
    const assetType: string = rootStore.openObject(objectId);
    unityStore.triggerInteractionMessage(PosBusEventEnum.EnteredSpace, objectId, 0, '');

    history.push(generatePath(ROUTES.object.base, {objectId, assetType}));

    return () => {
      unityStore.triggerInteractionMessage(PosBusEventEnum.LeftSpace, objectId, 0, '');
      objectStore.resetModel();
    };
  }, [rootStore, objectId, unityStore, objectStore, history]);

  return (
    <styled.Container>
      <Switch>
        <Route path={generatePath(ROUTES.object.base, {objectId, assetType: 'plugin'})}>
          {asset?.plugin && (
            <ObjectPluginPage plugin={asset.plugin} pluginLoader={asset} objectId={objectId} />
          )}
        </Route>
      </Switch>

      <styled.BottomCenteredDock>
        <EmojiAnimationDock />
      </styled.BottomCenteredDock>
    </styled.Container>
  );
};

export default observer(Object);
