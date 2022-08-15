import React, {FC, useEffect} from 'react';
import {generatePath, Switch, useParams, useRouteMatch} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';

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
    unityStore.changeKeyboardControl(false);

    return () => {
      unityStore.changeKeyboardControl(true);
    };
  }, [unityStore]);

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
  }, [spaceId, spaceManagerStore, unityStore]);

  const tabs: NavigationTabInterface[] = [
    {
      path: generatePath(ROUTES.spaceAdmin.base, {spaceId}),
      iconName: 'tiles',
      canGoBack: true,
      replace: true,
      exact: true,
      title: t('labels.manageSpace')
    },
    {
      path: generatePath(ROUTES.spaceAdmin.broadcast, {spaceId}),
      iconName: 'airport-signal',
      canGoBack: true,
      replace: true,
      exact: true,
      title: t('labels.manageBroadcast')
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
