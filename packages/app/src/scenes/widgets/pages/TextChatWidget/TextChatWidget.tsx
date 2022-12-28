import {Heading, IconSvg, Portal, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {useStore} from 'shared/hooks';

import {TextChatPanel} from './components';
import * as styled from './TextChatWidget.styled';

const TextChatWidget: FC = () => {
  const {widgetsStore, sessionStore, mainStore} = useStore();
  const {worldStore} = mainStore;
  const {textChatStore, voiceChatStore} = widgetsStore;
  const {streamChatStore} = textChatStore;

  const {t} = useTranslation();

  useEffect(() => {
    streamChatStore.init(sessionStore.userId, worldStore.worldId, sessionStore.user ?? undefined);

    return () => {
      streamChatStore.deinit(worldStore.worldId);
    };
  }, [sessionStore.user, sessionStore.userId, streamChatStore, worldStore.worldId]);

  const handleClose = useCallback(() => {
    textChatStore.widget.close();
  }, [textChatStore]);

  return (
    <Portal>
      {/* FIXME: Design discussion in order to avoid relation to VoiceChatStore */}
      <styled.Modal style={{marginRight: voiceChatStore.widget.isOpen ? '310px' : '20px'}}>
        <styled.Container>
          <styled.Header>
            <styled.HeaderItemsGroup>
              <IconSvg name="groupChat" size="medium" />
              <Heading label={t('labels.chat')} transform="uppercase" type="h2" />
            </styled.HeaderItemsGroup>
            <styled.HeaderItemsGroup>
              <SvgButton iconName="close" size="medium" onClick={handleClose} />
            </styled.HeaderItemsGroup>
          </styled.Header>
          <styled.Body>
            <TextChatPanel />
          </styled.Body>
        </styled.Container>
      </styled.Modal>
    </Portal>
  );
};

export default observer(TextChatWidget);
