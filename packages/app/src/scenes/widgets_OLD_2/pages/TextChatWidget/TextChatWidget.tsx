import React, {FC, useEffect} from 'react';
import {
  Heading,
  IconSvg,
  ScreenSectionsEnum,
  SectionedScreenPortal,
  SvgButton
} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';

import {TextChat} from './components';
import * as styled from './TextChatWidget.styled';

const TextChatWidget: FC = () => {
  const {widgetsStore, sessionStore, universeStore} = useStore();
  const {world3dStore} = universeStore;
  const {textChatStore} = widgetsStore;
  const {streamChat} = textChatStore;

  const {t} = useI18n();

  useEffect(() => {
    streamChat.init(sessionStore.userId, universeStore.worldId, sessionStore.user);

    return () => {
      streamChat.deinit(universeStore.worldId);
    };
  }, [sessionStore.user, sessionStore.userId, streamChat, universeStore.worldId]);

  return (
    <SectionedScreenPortal section={ScreenSectionsEnum.TOP_RIGHT}>
      <styled.Container>
        <styled.Header>
          <styled.HeaderItemsGroup>
            <IconSvg name="groupChat" size="medium" />
            <Heading label={t('labels.chat')} transform="uppercase" type="h2" />
          </styled.HeaderItemsGroup>
          <styled.HeaderItemsGroup>
            <SvgButton iconName="close" size="medium" onClick={textChatStore.dialog.close} />
          </styled.HeaderItemsGroup>
        </styled.Header>

        <styled.Body>
          {streamChat.client && streamChat.currentChannel && (
            <TextChat
              client={streamChat.client}
              channel={streamChat.currentChannel}
              onFocus={() => world3dStore?.changeKeyboardControl(false)}
              onBlur={() => world3dStore?.changeKeyboardControl(true)}
            />
          )}
        </styled.Body>
      </styled.Container>
    </SectionedScreenPortal>
  );
};

export default observer(TextChatWidget);
