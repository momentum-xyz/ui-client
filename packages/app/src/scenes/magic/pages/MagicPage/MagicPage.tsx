import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory, useParams} from 'react-router';
import {generatePath} from 'react-router-dom';

import {ROUTES, TELEPORT_DELAY_MS} from 'core/constants';
import {useStore} from 'shared/hooks';
import {MagicTypeEnum} from 'core/enums';

const MagicPage: FC = () => {
  const {mainStore, magicStore} = useStore();
  const {unityStore} = mainStore;

  const {id} = useParams<{id: string}>();
  const history = useHistory();

  const handleMagic = useCallback(() => {
    if (!magicStore.magicLink) {
      return;
    }

    const spaceId = magicStore.magicLink.data.spaceId;

    switch (magicStore.magicLink.data.type) {
      case MagicTypeEnum.FLY:
        unityStore.teleportToVector3(magicStore.magicLink.data.position);
        history.replace({pathname: ROUTES.base});
        break;
      case MagicTypeEnum.OPEN_SPACE:
        unityStore.teleportToSpace(spaceId);
        setTimeout(() => {
          history.push(generatePath(ROUTES.collaboration.dashboard, {spaceId}));
        }, TELEPORT_DELAY_MS);
        break;
      case MagicTypeEnum.JOIN_MEETING:
        unityStore.teleportToSpace(spaceId);
        setTimeout(() => {
          history.push({pathname: generatePath(ROUTES.grabTable, {spaceId})});
        }, TELEPORT_DELAY_MS);
        break;
      case MagicTypeEnum.EVENT: {
        unityStore.teleportToSpace(spaceId);
        setTimeout(() => {
          const params = {spaceId: spaceId, eventId: magicStore.magicLink?.data.eventId ?? ''};
          history.push(generatePath(ROUTES.collaboration.calendarEvent, params));
        }, TELEPORT_DELAY_MS);
        break;
      }
      default:
        history.replace({pathname: ROUTES.base});
        break;
    }
  }, [history, magicStore.magicLink, unityStore]);

  useEffect(() => {
    magicStore.getMagicLink(id);
  }, [id, magicStore]);

  useEffect(() => {
    if (unityStore.isTeleportReady && magicStore.magicLink) {
      handleMagic();
    }
  }, [handleMagic, magicStore.magicLink, unityStore.isTeleportReady]);

  return <></>;
};

export default observer(MagicPage);
