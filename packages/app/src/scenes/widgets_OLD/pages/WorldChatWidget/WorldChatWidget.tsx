import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'styled-components';
import {Dialog, Loader} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {StreamChat} from 'scenes/collaboration/components';

import * as styled from './WorldChatWidget.styled';

interface PropsInterface {
  onClose: () => void;
}

const WorldChatWidget: FC<PropsInterface> = ({onClose}) => {
  const {worldChatStore, mainStore} = useStore();
  const {unityStore} = mainStore;

  const {t} = useTranslation();
  const theme = useTheme();

  const handleSearchFocus = (isFocused: boolean) => {
    unityStore.changeKeyboardControl(!isFocused);
  };

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
            onFocus={() => handleSearchFocus(true)}
            onBlur={() => handleSearchFocus(false)}
          />
        )}
      </styled.Container>
    </Dialog>
  );
};

export default observer(WorldChatWidget);
