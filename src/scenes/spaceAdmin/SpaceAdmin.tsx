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

  const {spaceManagerStore} = useStore().spaceAdminStore;

  const history = useHistory();

  const routes = useMemo(() => {
    return PRIVATE_ROUTES(path);
  }, []);

  useEffect(() => {
    if (spaceId) {
      spaceManagerStore.resetModel();
      spaceManagerStore.init(spaceId);
    }

    return spaceManagerStore.resetModel;
  }, [history.location.pathname]);

  return <Switch>{createRoutesByConfig(routes)}</Switch>;
};

export default observer(SpaceAdmin);
