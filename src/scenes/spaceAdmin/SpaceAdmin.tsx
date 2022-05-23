import React, {FC, useEffect, useMemo} from 'react';
import {Switch, useParams, useRouteMatch} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {useHistory} from 'react-router';

import {createRoutesByConfig} from 'core/utils';
import {useStore} from 'shared/hooks';

import {PRIVATE_ROUTES} from './SpaceAdminRoutes';

const SpaceAdmin: FC = () => {
  const {path} = useRouteMatch();

  const {spaceId} = useParams<{spaceId?: string}>();

  const {
    spaceAdminStore,
    mainStore: {unityStore}
  } = useStore();
  const {spaceManagerStore} = spaceAdminStore;

  const history = useHistory();

  const routes = useMemo(() => {
    return PRIVATE_ROUTES(path);
  }, [path]);

  useEffect(() => {
    if (spaceId) {
      unityStore.changeKeyboardControl(false);
      spaceManagerStore.resetModel();
      spaceManagerStore.init(spaceId);
    }

    return () => {
      unityStore.changeKeyboardControl(true);
      spaceManagerStore.resetModel();
    };
  }, [history.location.pathname, spaceId, spaceManagerStore]);

  useEffect(() => {
    unityStore.changeKeyboardControl(false);

    return () => unityStore.changeKeyboardControl(true);
  }, [unityStore]);

  return <Switch>{createRoutesByConfig(routes)}</Switch>;
};

export default observer(SpaceAdmin);
