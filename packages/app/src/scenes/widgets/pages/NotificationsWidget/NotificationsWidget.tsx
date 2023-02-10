import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {Dialog, Loader, Text} from '@momentum-xyz/ui-kit';
import {useTranslation} from 'react-i18next';

import {useNavigation, useStore} from 'shared/hooks';
import {NewsfeedItem} from 'ui-kit';

import * as styled from './NotificationsWidget.styled';

const DIALOG_OFFSET_RIGHT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const NotificationsWidget: FC = () => {
  const {widgetsStore, nftStore, sessionStore} = useStore();
  const {notificationsStore} = widgetsStore;
  const {dialog, notifications} = notificationsStore;

  const theme = useTheme();
  const {t} = useTranslation();
  const {goToOdysseyHome} = useNavigation();

  useEffect(() => {
    notificationsStore.init();

    const timeInterval = setInterval(() => {
      notificationsStore.fetchNotifications();
    }, 15000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [notificationsStore]);

  return (
    <Dialog
      theme={theme}
      icon="clock-two"
      iconSize="medium"
      position="rightBottom"
      headerStyle="normal"
      headerType="h2"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      title="Newsfeed"
      onClose={dialog.close}
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
              <NewsfeedItem
                key={index}
                item={item}
                nftItems={nftStore.nftItems}
                currentUser={sessionStore.user}
                onTeleport={() => goToOdysseyHome(item.uuid)}
                onConnect={() => {}}
                onAttend={() => {}}
                onOpenOdyssey={(uuid) => {
                  widgetsStore.odysseyInfoStore.open(nftStore.getNftByUuid(uuid));
                }}
              />
            ))}
          </styled.Body>
        )}

        {!notificationsStore.isPending && !notifications.length && (
          <styled.EmptyResult>
            <Text text={t('messages.noResultsFound')} size="xs" />
          </styled.EmptyResult>
        )}
      </styled.Container>
    </Dialog>
  );
};

export default observer(NotificationsWidget);
