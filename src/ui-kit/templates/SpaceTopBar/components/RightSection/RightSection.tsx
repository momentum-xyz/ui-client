import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {generatePath} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {Separator, ToolbarIcon} from 'ui-kit';
// TODO: Refactoring
import {COLLABORATION_CHAT_ACTION_UPDATE} from 'context/Collaboration/CollaborationReducer';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';
import {useTextChatContext} from 'context/TextChatContext';

import * as styled from './RightSection.styled';

interface PropsInterface {
  isAdmin?: boolean;
  spaceId: string;
  editSpaceHidden?: boolean;
  isSpaceFavorite: boolean;
  toggleIsSpaceFavorite: (spaceId: string) => void;
}

const RightSection: FC<PropsInterface> = ({
  spaceId,
  editSpaceHidden,
  isAdmin,
  isSpaceFavorite,
  toggleIsSpaceFavorite
}) => {
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {numberOfUnreadMessages} = useTextChatContext();

  // TODO: Refactoring
  const toggleChat = () => {
    collaborationDispatch({
      type: COLLABORATION_CHAT_ACTION_UPDATE,
      open: !collaborationState.chatOpen
    });
  };

  return (
    <>
      {isAdmin && !editSpaceHidden && (
        <>
          <ToolbarIcon
            title={t('tooltipTitles.openAdmin')}
            icon="pencil"
            link={generatePath(ROUTES.spaceAdmin.base, {spaceId})}
            isActive={(match, location) => {
              return location.pathname.includes(generatePath(ROUTES.spaceAdmin.base, {spaceId}));
            }}
            state={{canGoBack: true}}
            isWhite={false}
            toolTipPlacement="bottom"
          />
          <Separator />
        </>
      )}
      <ToolbarIcon
        title={
          collaborationState.chatOpen ? t('tooltipTitles.closeChat') : t('tooltipTitles.openChat')
        }
        icon="chat"
        onClick={toggleChat}
        isWhite={false}
      >
        {numberOfUnreadMessages > 0 && (
          <styled.MessageCount>{numberOfUnreadMessages}</styled.MessageCount>
        )}
      </ToolbarIcon>
      <ToolbarIcon
        title={t('tooltipTitles.favorite')}
        icon={isSpaceFavorite ? 'starOn' : 'star'}
        onClick={() => toggleIsSpaceFavorite(spaceId)}
        isWhite={false}
      />
      <Separator />
      <ToolbarIcon title={t('tooltipTitles.flyAround')} icon="fly-to" link={ROUTES.base} />
    </>
  );
};

export default observer(RightSection);
