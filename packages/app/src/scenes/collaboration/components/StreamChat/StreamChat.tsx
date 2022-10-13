import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {ErrorBoundary} from '@momentum-xyz/ui-kit';
import {StreamChat as StreamChatClient, Channel} from 'stream-chat';
import {
  Chat,
  Channel as ChannelComponent,
  Window,
  VirtualizedMessageList,
  MessageInput,
  Streami18n
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import {useTranslation} from 'react-i18next';

import * as styled from './StreamChat.styled';
import {CustomMessageInput} from './components/';

interface PropsInterface {
  client: StreamChatClient;
  channel: Channel;
  fullWidth?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const i18nInstance = new Streami18n({
  language: 'en'
  // there's also this, but probably it's not needed with set language
  // disableDateTimeTranslations: true
});

const StreamChat: FC<PropsInterface> = ({client, channel, fullWidth, onFocus, onBlur}) => {
  const {t} = useTranslation();

  return (
    client &&
    channel && (
      <ErrorBoundary errorMessage={t('errors.somethingWentWrong')}>
        <styled.Container
          className={fullWidth ? 'full-width' : undefined}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <Chat client={client} theme="str-chat__theme-dark" i18nInstance={i18nInstance}>
            <ChannelComponent channel={channel} Input={CustomMessageInput}>
              <Window>
                <VirtualizedMessageList disableDateSeparator shouldGroupByUser />
                <MessageInput disableMentions grow maxRows={5} />
              </Window>
            </ChannelComponent>
          </Chat>
        </styled.Container>
      </ErrorBoundary>
    )
  );
};

export default observer(StreamChat);
