import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {Dialog, Loader} from '@momentum/ui-kit';

import {useStore} from 'shared/hooks';
import {StreamChat} from 'scenes/collaboration/components/StreamChat';

import * as styled from './WorldChatWidget.styled';

interface PropsInterface {
  onClose: () => void;
}

const WorldChatWidget: FC<PropsInterface> = ({onClose}) => {
  const {
    worldChatStore,
    mainStore
    // sessionStore
  } = useStore();
  // const {worldId} = mainStore.worldStore;
  const {unityStore} = mainStore;

  const {t} = useTranslation();
  const theme = useTheme();

  useEffect(() => {
    const isAlreadyPaused = unityStore.isPaused;
    console.log('WorldChatWidget - check', isAlreadyPaused);
    if (!isAlreadyPaused) {
      console.log('WorldChatWidget - pause');
      unityStore.pause();
    }

    return () => {
      // if it was paused before opening the chat, perhaps we want it to stay paused
      if (!isAlreadyPaused) {
        console.log('WorldChatWidget - resume');
        unityStore.resume();
      }
    };
  }, [unityStore]);

  // useEffect(() => {
  //   if (!worldChatStore.isLoggedOn) {
  //     console.log('WorldChatWidget - init store');
  //     worldChatStore.init(sessionStore.userId, worldId, sessionStore.profile ?? undefined);
  //   }
  // }, [worldChatStore, sessionStore, worldId]);

  return (
    <Dialog
      theme={theme}
      title={t('titles.worldChat')}
      headerStyle="uppercase"
      showCloseButton
      showOverflow
      withOpacity
      isBodyExtendingToEdges
      onClose={worldChatStore.textChatDialog.close}
    >
      <styled.Container>
        {!worldChatStore.isLoggedOn && <Loader />}
        {worldChatStore.client && worldChatStore.currentChannel && (
          <StreamChat
            fullWidth
            client={worldChatStore.client}
            channel={worldChatStore.currentChannel}
          />
        )}
      </styled.Container>
    </Dialog>
  );
};

export default observer(WorldChatWidget);
