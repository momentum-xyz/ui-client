import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {generatePath} from 'react-router-dom';

import {Separator, ToolbarIcon} from 'ui-kit/index';
import {FavoriteStoreInterface} from 'stores/MainStore/models';
import {COLLABORATION_CHAT_ACTION_UPDATE} from 'context/Collaboration/CollaborationReducer';
import useCollaboration from 'context/Collaboration/hooks/useCollaboration';
import {useTextChatContext} from 'context/TextChatContext';
import {ROUTES} from 'core/constants';

import * as styled from './RightSection.styled';

interface PropsInterface {
  isAdmin?: boolean;
  spaceId?: string;
  editSpaceHidden?: boolean;
  favoriteStore: FavoriteStoreInterface;
}

const RightSection: FC<PropsInterface> = ({isAdmin, favoriteStore, spaceId, editSpaceHidden}) => {
  const {collaborationState, collaborationDispatch} = useCollaboration();
  const {numberOfUnreadMessages} = useTextChatContext();

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
        icon={favoriteStore.isSpaceFavorite ? 'starOn' : 'star'}
        onClick={toggleFavorite}
        isWhite={false}
      />
      <Separator />
      <ToolbarIcon title={t('tooltipTitles.flyAround')} icon="fly-to" link={ROUTES.base} />
    </>
  );
};

export default observer(RightSection);
