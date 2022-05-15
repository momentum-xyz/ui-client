import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useHistory} from 'react-router';
import {toast} from 'react-toastify';
import {useTheme} from 'styled-components';
import {t} from 'i18next';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {ROUTES} from 'core/constants';
import {ToastContent, TOAST_BASE_OPTIONS} from 'ui-kit';
import {OnlineUsersWidget} from 'scenes/widgets/pages/OnlineUsersWidget';

import SocialSpaces from '../../molucules/socialui/SocialSpaces';
import useWebsocketEvent from '../../../context/Websocket/hooks/useWebsocketEvent';
import {useGetSpace} from '../../../hooks/api/useSpaceService';
import {useJoinCollaborationSpaceByAssign} from '../../../context/Collaboration/hooks/useCollaboration';
import UnityService from '../../../context/Unity/UnityService';

const SocialLayout: React.FC = () => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const {worldStore, unityStore} = useStore().mainStore;
  const location = useLocation();
  const [showLayer, setShowLayer] = useState<boolean>();
  const [selectedUserInitiative, setSelectedUserInitiative] = useState<Buffer>();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();
  const history = useHistory();

  useWebsocketEvent('space-invite', (spaceId, invitorId, invitorName, uiTypeId) => {
    const handleJoinSpace = () => {
      UnityService.teleportToSpace(spaceId);

      joinMeetingSpace(spaceId, uiTypeId === '285ba49f-fee3-40d2-ab55-256b5804c20c').then(() => {
        if (uiTypeId !== '285ba49f-fee3-40d2-ab55-256b5804c20c') {
          unityStore.pause();
          history.push({pathname: ROUTES.collaboration});
        }
      });
    };

    const Content: React.FC = () => {
      const [spaceInfo, , ,] = useGetSpace(spaceId);

      return (
        <ToastContent
          headerIconName="alert"
          text={t('messages.joinSpaceWelcome')}
          theme={theme}
          title={t('messages.spaceInvitationNote', {
            invitor: invitorName,
            spaceName: spaceInfo?.space.name
          })}
          approveInfo={{title: t('titles.joinSpace'), onClick: handleJoinSpace}}
        />
      );
    };

    toast.info(<Content />, TOAST_BASE_OPTIONS);
  });

  useEffect(() => {
    if (location.pathname === ROUTES.base) {
      setShowLayer(true);
    } else {
      setShowLayer(false);
    }
  }, [location]);

  if (!showLayer) {return null;}

  const handleUserInitiativeSelect = (spaceId: Buffer) => {
    setSelectedUserInitiative(spaceId);
  };

  return (
    <div className="relative flex flex-row justify-between w-full z-overlay pointer-events-none h-full mt-2 mx-.3">
      <SocialSpaces
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        worldId={worldStore.worldId}
        selectedUserInitiative={selectedUserInitiative}
        setSelectedUserInitiative={setSelectedUserInitiative}
      />
      <OnlineUsersWidget onUserInitiativeSelect={handleUserInitiativeSelect} />
    </div>
  );
};

export default observer(SocialLayout);
