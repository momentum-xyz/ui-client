import {observer} from 'mobx-react-lite';
import {FC} from 'react';

import {StreamChat} from 'scenes/collaboration/components';
import {useStore} from 'shared/hooks';

const TextChatPanel: FC = () => {
  const {widgetsStore, mainStore} = useStore();
  const {unityStore} = mainStore;
  const {textChatStore} = widgetsStore;
  const {streamChatStore} = textChatStore;

  return (
    streamChatStore.client &&
    streamChatStore.currentChannel && (
      <StreamChat
        client={streamChatStore.client}
        channel={streamChatStore.currentChannel}
        onFocus={() => {
          unityStore.changeKeyboardControl(false);
        }}
        onBlur={() => {
          unityStore.changeKeyboardControl(true);
        }}
        fullWidth
      />
    )
  );
};

export default observer(TextChatPanel);
