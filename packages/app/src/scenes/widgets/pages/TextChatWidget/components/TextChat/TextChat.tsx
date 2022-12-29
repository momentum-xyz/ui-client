import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
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

import * as styled from './TextChat.styled';
import {CustomMessageInput} from './components';

import 'stream-chat-react/dist/css/v2/index.css';

interface PropsInterface {
  client: StreamChatClient;
  channel: Channel;
  onFocus?: () => void;
  onBlur?: () => void;
}

const i18nInstance = new Streami18n({
  language: 'en'
  // there's also this, but probably it's not needed with set language
  // disableDateTimeTranslations: true
});

const TextChat: FC<PropsInterface> = (props) => {
  const {client, channel, onFocus, onBlur} = props;

  const {t} = useTranslation();

  return (
    <ErrorBoundary errorMessage={t('errors.somethingWentWrong')}>
      <styled.Container>
        <Chat client={client} theme="str-chat__theme-dark" i18nInstance={i18nInstance}>
          <ChannelComponent channel={channel} Input={CustomMessageInput}>
            <Window>
              <VirtualizedMessageList disableDateSeparator shouldGroupByUser />
              <MessageInput
                grow
                maxRows={5}
                disableMentions
                additionalTextareaProps={{
                  placeholder: `${t('textMessage.placeholder')}...`,
                  onFocus: onFocus,
                  onBlur: onBlur
                }}
              />
            </Window>
          </ChannelComponent>
        </Chat>
      </styled.Container>
    </ErrorBoundary>
  );
};

export default observer(TextChat);
