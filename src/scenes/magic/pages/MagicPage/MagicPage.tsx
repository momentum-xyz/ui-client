import React, {FC, useCallback, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useHistory, useParams} from 'react-router';
import {generatePath} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {MagicTypeEnum} from 'core/enums';

const TELEPORT_DELAY_MS = 3000;

const MagicPage: FC = () => {
  const {mainStore, magicStore} = useStore();
  const {unityStore} = mainStore;
  const {magic} = magicStore;

  const {key} = useParams<{key: string}>();
  const history = useHistory();

  const handleMagic = useCallback(() => {
    if (!magicStore.magic) {
      return;
    }

    if (magicStore.magic.expired) {
      history.replace({pathname: ROUTES.base});
      return;
    }

    const id = magicStore.magic.data.id;

    switch (magicStore.magic.type) {
      case MagicTypeEnum.FLY: {
        unityStore.teleportToVector3(magicStore.magic.data.position);
        history.replace({pathname: ROUTES.base});
        break;
      }

      case MagicTypeEnum.OPEN_SPACE:
        unityStore.teleportToSpace(id);
        setTimeout(() => {
          const params = {spaceId: id};
          history.push(generatePath(ROUTES.collaboration.dashboard, params));
        }, TELEPORT_DELAY_MS);
        break;

      case MagicTypeEnum.EVENT: {
        unityStore.teleportToSpace(id);
        setTimeout(() => {
          const params = {spaceId: id, eventId: magicStore.magic?.data.eventId ?? ''};
          history.push(generatePath(ROUTES.collaboration.calendarEvent, params));
        }, TELEPORT_DELAY_MS);
        break;
      }

      default:
        history.replace({pathname: ROUTES.base});
        break;
    }
  }, [history, magicStore.magic, unityStore]);

  useEffect(() => {
    magicStore.getMagicLink(key);
  }, [key, magicStore]);

  useEffect(() => {
    if (unityStore.isTeleportReady && magic?.id) {
      handleMagic();
    }
  }, [handleMagic, magic?.id, unityStore.isTeleportReady]);

  return <></>;
};

export default observer(MagicPage);
