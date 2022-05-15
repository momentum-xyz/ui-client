import React, {useEffect} from 'react';
import {useHistory, useParams} from 'react-router';
import {observer} from 'mobx-react-lite';

import {MagicTypeEnum} from 'core/enums';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {useJoinCollaborationSpaceByAssign} from 'context/Collaboration/hooks/useCollaboration';

interface MagicPageProps {
  children?: React.ReactNode;
}

const MagicPage: React.FC<MagicPageProps> = (props) => {
  const {
    mainStore: {unityStore},
    magicStore
  } = useStore();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();
  const {key} = useParams<{key: string}>();

  useEffect(() => {
    if (key) {
      magicStore.getMagicLink(key);
    }
  }, [key]);

  const handleMagic = () => {
    if (!magicStore.magic) {
      return;
    }

    if (magicStore.magic.expired) {
      history.replace({pathname: ROUTES.base});
      return;
    }

    switch (magicStore.magic.type) {
      case MagicTypeEnum.OPEN_SPACE:
        unityStore.teleportToSpace(magicStore.magic.data.id);
        joinMeetingSpace(magicStore.magic.data.id).then(() => {
          setTimeout(() => {
            history.replace({pathname: ROUTES.dashboard});
          }, 3000);
        });
        break;
      case MagicTypeEnum.FLY: {
        unityStore.teleportToVector3(magicStore.magic.data.position);
        history.replace({pathname: ROUTES.base});
        break;
      }
      case MagicTypeEnum.EVENT: {
        unityStore.teleportToSpace(magicStore.magic.data.id);
        joinMeetingSpace(magicStore.magic.data.id).then(() => {
          setTimeout(() => {
            history.replace({
              pathname: `${ROUTES.calendar}/${magicStore.magic?.data.eventId ?? ''}`
            });
          }, 3000);
        });
        break;
      }
      default:
        history.replace({pathname: ROUTES.base});
        break;
    }
  };

  useEffect(() => {
    if (unityStore.teleportReady) {
      handleMagic();
    }
  }, [magicStore.magic, unityStore.teleportReady]);

  return <>{props.children}</>;
};

export default observer(MagicPage);
