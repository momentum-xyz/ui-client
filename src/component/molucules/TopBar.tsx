import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';

import {useStore} from 'shared/hooks';
import {IconSvg} from 'ui-kit';

import {COLLABORATION_CHAT_ACTION_UPDATE} from '../../context/Collaboration/CollaborationReducer';
import useCollaboration, {
  useLeaveCollaborationSpace
} from '../../context/Collaboration/hooks/useCollaboration';
import {ReactComponent as CloseIcon} from '../../images/icons/close.svg';
import {ReactComponent as PencilIcon} from '../../images/icons/pencil.svg';
import {ReactComponent as ChatIcon} from '../../images/icons/conversation-chat-1.svg';
import {ReactComponent as RocketIcon} from '../../images/icons/space-rocket-earth.svg';
import TopbarButton from '../atoms/topbar/TopbarButton';
import {AddUserPopup} from '../../modules/spaceadmin/popups/AddUserPopup';
import Modal, {ModalRef} from '../util/Modal';
import {useStageModeLeave} from '../../hooks/api/useStageModeService';
import {useTextChatContext} from '../../context/TextChatContext';
import UnityService, {PosBusInteractionType} from '../../context/Unity/UnityService';
import {SpaceType} from '../../context/type/Space';

export type TopBarProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  collaboration?: boolean;
  isAdmin?: boolean;
  adminActions?: React.ReactNode;
};

const getWindowDimensions = () => {
  const {innerWidth: width, innerHeight: height} = window;
  return {
    width,
    height
  };
};

const TopBar = ({
  title,
  subtitle,
  actions,
  collaboration = false,
  isAdmin = false,
  adminActions
}: TopBarProps) => {
  // const { title, subTitle, actions } = useContext(TopBarContext);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const {numberOfUnreadMessages} = useTextChatContext();
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const leaveCollaborationSpaceCall = useLeaveCollaborationSpace();
  const stageModeLeave = useStageModeLeave(collaborationState.collaborationSpace?.id);
  const history = useHistory();
  const currentLocation = useLocation();
  const {favoriteStore} = useStore();

  const addUserModal = useRef<ModalRef>(null);

  const spaceId = collaborationState.collaborationSpace?.id;
  const spaceType = collaborationState.collaborationSpace?.type;

  const leaveCollaborationSpace = () => {
    if (collaborationState.collaborationSpace && collaboration) {
      UnityService.triggerInteractionMsg?.(
        PosBusInteractionType.LeftSpace,
        collaborationState.collaborationSpace.id,
        0,
        ''
      );
      leaveCollaborationSpaceCall(false).then(stageModeLeave);

      if (collaborationState.stageMode) {
        collaborationDispatch({
          type: 'COLLABORATION_STAGE_MODE_ACTION_UPDATE',
          stageMode: false
        });
      }
    }
  };

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    console.info('SPACE_TYPE');
    console.info(spaceType);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (collaborationState.collaborationSpace) {
      favoriteStore.setSpaceId(collaborationState.collaborationSpace.id);
    }
  }, [collaborationState.collaborationSpace]);

  const toggleChat = () => {
    collaborationDispatch({
      type: COLLABORATION_CHAT_ACTION_UPDATE,
      open: !collaborationState.chatOpen
    });
  };

  const toggleFavorite = () => {
    if (spaceId) {
      if (favoriteStore.isSpaceFavorite) {
        favoriteStore.removeFavorite(spaceId);
      } else {
        favoriteStore.addFavorite(spaceId);
      }
    }
  };

  const isAdminShown = () => {
    return currentLocation.pathname.includes('/space/' + spaceId + '/admin');
  };

  return (
    <div className="flex flex-shrink-0 items-center h-6 min-h-6 bg-gradient-blue-green-20 backdrop-filter backdrop-blur px-2 m-1 box-content rounded">
      <div>
        <h2
          className="font-bold font-sans uppercase text-xl pl-0 h-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
          id="TopBar_spaceTitle"
          style={{
            maxWidth: `${windowDimensions.width - 680}px`
          }}
        >
          {title}
          {subtitle && (
            <span className="font-normal font-sans text-xl">&nbsp;&nbsp;/&nbsp; {subtitle}</span>
          )}
        </h2>
      </div>
      <div className="pl-1 flex items-center gap-2 flex-grow">{actions}</div>

      {!!isAdmin &&
        !!spaceId &&
        spaceType !== SpaceType.GRAB_A_TABLE &&
        !currentLocation.pathname.includes('/admin') && (
          <>
            <TopbarButton
              title="Open Admin"
              link={'/space/' + spaceId + '/admin'}
              isActive={(match, location) => {
                return location.pathname.includes('/space/' + spaceId + '/admin');
              }}
              state={{canGoBack: true}}
            >
              <PencilIcon />
            </TopbarButton>
            {adminActions}
          </>
        )}

      {!!(isAdmin && collaborationState.collaborationSpace && collaboration) && (
        <>
          <div className="bg-white-100 w-.1 h-2 ml-2" />
        </>
      )}

      {!!(collaborationState.collaborationSpace && collaboration) && (
        <>
          <TopbarButton
            title={collaborationState.chatOpen ? 'Close chat' : 'Open chat'}
            onClick={toggleChat}
          >
            <ChatIcon />
            {numberOfUnreadMessages > 0 && (
              <span className="badge primary -top-1 -right-1 absolute">
                {numberOfUnreadMessages}
              </span>
            )}
          </TopbarButton>
          <TopbarButton title="Favorite" onClick={toggleFavorite}>
            <IconSvg
              name={favoriteStore.isSpaceFavorite ? 'starOn' : 'star'}
              size="medium-large"
              isWhite={true}
              isCustom
            />
          </TopbarButton>
          <div className="bg-white-100 w-.1 h-2 ml-2" />
          <TopbarButton link="/" title="Fly around!">
            <RocketIcon />
          </TopbarButton>
        </>
      )}

      {!isAdminShown() && (
        <TopbarButton
          isActive={() => false}
          link="/"
          onClick={() => leaveCollaborationSpace()}
          title={collaborationState.collaborationSpace && collaboration ? 'Leave' : 'Close'}
        >
          <CloseIcon />
        </TopbarButton>
      )}

      {isAdminShown() && (
        <TopbarButton onClick={history.goBack} title="Close Admin">
          <CloseIcon />
        </TopbarButton>
      )}

      <Modal ref={addUserModal}>
        <AddUserPopup
          onClose={() => addUserModal.current?.close()}
          onEmailSend={() => addUserModal.current?.close()}
          onSave={() => {
            addUserModal.current?.close();
          }}
        />
      </Modal>
    </div>
  );
};

export default observer(TopBar);
