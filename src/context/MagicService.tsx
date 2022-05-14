import React, {useCallback, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useHistory} from 'react-router';

import {request} from 'api/request';
import {MagicTypeEnum} from 'core/enums';
import {MagicLinkInterface} from 'core/interfaces';
import {ROUTES} from 'core/constants';

import {useJoinCollaborationSpaceByAssign} from './Collaboration/hooks/useCollaboration';
import UnityService from './Unity/UnityService';
import useUnityEvent from './Unity/hooks/useUnityEvent';

interface MagicServiceProps {
  children?: React.ReactNode;
}

const MagicService: React.FC = (props: MagicServiceProps) => {
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const location = useLocation();
  const history = useHistory();
  const [magic, setMagic] = useState<MagicLinkInterface>();
  const [teleportReady, setTeleportReady] = useState(false);

  useUnityEvent('TeleportReady', () => {
    console.info('TeleportReady');
    setTeleportReady(true);
  });

  const getMagicLink = useCallback(async (key: string) => {
    try {
      return await request.get<MagicLinkInterface>(
        window._env_.BACKEND_ENDPOINT_URL + `/magic/${key}`
      );
    } catch (e) {
      throw e;
    }
  }, []);

  useEffect(() => {
    if (location.pathname.indexOf('magic') > -1) {
      const pathElements = location.pathname.split('/');
      const key: string | null = pathElements[2] ? pathElements[2] : null;

      if (key) {
        getMagicLink(key).then((resp) => {
          if (resp.status === 200) setMagic(resp.data);
        });
      }
    }
  }, []);

  const handleMagic = (magic: MagicLinkInterface) => {
    if (!magic) return;

    if (magic.expired) {
      // Redirect to login?
      console.info('The magic has expired');
      return;
    }

    switch (magic.type) {
      case MagicTypeEnum.OPEN_SPACE:
        UnityService.teleportToSpace(magic.data.id);
        joinMeetingSpace(magic.data.id).then(() => {
          setTimeout(() => {
            history.replace({pathname: ROUTES.dashboard});
          }, 3000);
        });
        break;
      case MagicTypeEnum.FLY: {
        UnityService.teleportToVector3(magic.data.position);
        history.replace({pathname: ROUTES.base});
        break;
      }
      case MagicTypeEnum.EVENT: {
        UnityService.teleportToSpace(magic.data.id);
        joinMeetingSpace(magic.data.id).then(() => {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            history.replace({pathname: `${ROUTES.calendar}/${magic.data.eventId}`});
          }, 3000);
        });
        break;
      }
      default:
        console.info('There is no magic here');
        history.replace({pathname: ROUTES.base});
        break;
    }
  };

  useEffect(() => {
    if (magic && teleportReady) {
      handleMagic(magic);
    }
  }, [magic, teleportReady]);

  return <>{props.children}</>;
};

export default MagicService;
