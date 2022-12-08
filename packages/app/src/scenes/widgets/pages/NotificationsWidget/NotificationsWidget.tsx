import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {Dialog, Loader, Text} from '@momentum-xyz/ui-kit';
import {generatePath, useHistory} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {NewsFeedItem} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './NotificationsWidget.styled';

const DIALOG_OFFSET_RIGHT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const NotificationsWidget: FC = () => {
  const {widgetsStore, mainStore, authStore} = useStore();
  const {notificationsStore} = widgetsStore;
  const {notificationsDialog, notifications} = notificationsStore;
  const {unityStore} = mainStore;

  const theme = useTheme();
  const history = useHistory();

  useEffect(() => {
    notificationsStore.init();
  }, [notificationsStore]);

  return (
    <Dialog
      icon="bell"
      theme={theme}
      position="rightBottom"
      headerStyle="uppercase"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      title="Newsfeed"
      onClose={notificationsDialog.close}
      showBackground={false}
      showCloseButton
    >
      <styled.Container data-testid="NotificationsWidget-test">
        {notificationsStore.isPending && (
          <styled.Loader>
            <Loader />
          </styled.Loader>
        )}
        {!notificationsStore.isPending && notifications.length && (
          <styled.Body>
            {notifications.map((item, index) => (
              <NewsFeedItem
                key={index}
                item={item}
                onTeleport={() => {
                  history.replace(generatePath(ROUTES.odyssey.base, {worldId: item.uuid}));
                  unityStore.loadWorldById(item.uuid, authStore.token);
                }}
                onConnect={() => {}}
                onAttend={(nft) => {
                  console.log(nft);
                }}
              />
            ))}
          </styled.Body>
        )}

        {!notificationsStore.isPending && !notifications.length && (
          <styled.EmptyResult>
            <Text text="No results found" size="xs" />
          </styled.EmptyResult>
        )}
      </styled.Container>
    </Dialog>
  );
};

export default observer(NotificationsWidget);
