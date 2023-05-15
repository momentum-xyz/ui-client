import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

const TextChatWidget: FC = () => {
  /*const {widgetsStore, sessionStore, universeStore} = useStore();
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
  );*/

  return <></>;
};

export default observer(TextChatWidget);
