import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {generatePath} from 'react-router-dom';

import {Separator, ToolbarIcon} from 'ui-kit';
import {FavoriteStoreInterface} from 'stores/MainStore/models';
import {useTextChatContext} from 'context/TextChatContext';
import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import * as styled from './TopBarActions.styled';

interface PropsInterface {
  isAdmin?: boolean;
  spaceId?: string;
  favoriteStore: FavoriteStoreInterface;
}

const TopBarActions: FC<PropsInterface> = ({isAdmin, favoriteStore, spaceId}) => {
  const {agoraStore} = useStore().mainStore;
  const {numberOfUnreadMessages} = useTextChatContext();

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
      {isAdmin && (
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
        title={agoraStore.isChatOpen ? t('tooltipTitles.closeChat') : t('tooltipTitles.openChat')}
        icon="chat"
        onClick={agoraStore.toggleChat}
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

export default observer(TopBarActions);
