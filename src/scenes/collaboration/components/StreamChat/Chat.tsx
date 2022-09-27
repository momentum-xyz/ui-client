import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {StreamChat, Channel} from 'stream-chat';
import {
  Chat,
  Channel as ChannelComponent,
  Window,
  VirtualizedMessageList,
  MessageInput
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

import * as styled from './Chat.styled';
import {CustomMessageInput} from './CustomMessageInput';
import {CustomReactionSelector} from './CustomReactionSelector';

interface PropsInterface {
  client: StreamChat;
  channel: Channel;
}

const SChat: FC<PropsInterface> = ({client, channel}) => {
  return (
    client && (
      <styled.Container>
        <Chat client={client} theme="str-chat__theme-dark">
          <ChannelComponent
            channel={channel}
            Input={CustomMessageInput}
            ReactionSelector={CustomReactionSelector}
          >
            <Window>
              {/* <ChannelHeader /> */}
              <VirtualizedMessageList disableDateSeparator={true} shouldGroupByUser={true} />
              <MessageInput disableMentions={true} />
            </Window>
          </ChannelComponent>
        </Chat>
      </styled.Container>
    )
  );
};

export default observer(SChat);
