import React, {FC, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {Navigation} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {createSwitchByConfig} from 'core/utils';

import {ADMIN_ROUTES, buildAdminNavigationTabs} from './SpaceAdmin.routes';

const SpaceAdmin: FC = () => {
  const {spaceAdminStore} = useStore();
  const {spaceManagerStore} = spaceAdminStore;

  const {spaceId} = useParams<{spaceId: string}>();

  useEffect(() => {
    spaceManagerStore.init(spaceId);

    return () => {
      spaceManagerStore.resetModel();
    };
  }, [spaceId, spaceManagerStore]);

  return (
    <>
      <Navigation tabs={buildAdminNavigationTabs(spaceId)} />
      {createSwitchByConfig(ADMIN_ROUTES)}
    </>
  );
};

export default observer(SpaceAdmin);
