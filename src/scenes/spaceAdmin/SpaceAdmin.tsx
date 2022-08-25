import React, {FC, useEffect} from 'react';
import {generatePath, Switch, useParams, useRouteMatch} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {Navigation} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {createRoutesByConfig} from 'core/utils';
import {NavigationTabInterface} from 'core/interfaces';

import {ADMIN_ROUTES} from './SpaceAdmin.routes';

const SpaceAdmin: FC = () => {
  const {spaceAdminStore, mainStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;
  const {unityStore} = mainStore;

  const {spaceId} = useParams<{spaceId?: string}>();
  const {path} = useRouteMatch();

  useEffect(() => {
    if (spaceId) {
      spaceManagerStore.resetModel();
      spaceManagerStore.init(spaceId);
    }

    return () => {
      spaceManagerStore.resetModel();
    };
  }, [spaceId, spaceManagerStore, unityStore]);

  const tabs: NavigationTabInterface[] = [
    {
      path: generatePath(ROUTES.spaceAdmin.base, {spaceId}),
      iconName: 'tiles',
      canGoBack: true,
      replace: true,
      exact: true
    },
    {
      path: generatePath(ROUTES.spaceAdmin.broadcast, {spaceId}),
      iconName: 'airport-signal',
      canGoBack: true,
      replace: true,
      exact: true
    }
  ];

  return (
    <>
      <Navigation tabs={tabs} />
      <Switch>{createRoutesByConfig(ADMIN_ROUTES(path))}</Switch>
    </>
  );
};

export default observer(SpaceAdmin);
