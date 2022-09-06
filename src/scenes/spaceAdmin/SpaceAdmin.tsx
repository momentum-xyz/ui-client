import React, {FC, useEffect} from 'react';
import {generatePath, useParams, useRouteMatch} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {Navigation} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {createSwitchByConfig} from 'core/utils';
import {NavigationTabInterface} from 'core/interfaces';

import {ADMIN_ROUTES} from './SpaceAdmin.routes';

const SpaceAdmin: FC = () => {
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;

  const {spaceId} = useParams<{spaceId: string}>();
  const {path} = useRouteMatch();

  useEffect(() => {
    spaceManagerStore.init(spaceId);

    return () => {
      spaceManagerStore.resetModel();
    };
  }, [spaceId, spaceManagerStore]);

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
      {createSwitchByConfig(ADMIN_ROUTES(path))}
    </>
  );
};

export default observer(SpaceAdmin);
