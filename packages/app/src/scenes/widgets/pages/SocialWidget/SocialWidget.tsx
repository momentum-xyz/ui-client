import {Heading, IconSvg, Portal, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback, useMemo, useState} from 'react';

import {useStore} from 'shared/hooks';

import {SocialTabBar, VoiceChatPanel} from './components';
import * as styled from './SocialWidget.styled';

interface SocialPanelTabInterface {
  name: string;
  main: () => JSX.Element | null;
}

// TODO: When implementing Chat, move this to seperate tab and implemnt it in it
const Chat: FC = () => {
  return <div>Chat</div>;
};

const SocialWidget: FC = () => {
  const {widgetsStore, agoraStore} = useStore();
  const {socialStore} = widgetsStore;

  const tabs: SocialPanelTabInterface[] = useMemo(
    () => [
      {
        name: 'Chat',
        main: () => <Chat />
      },
      {
        name: 'Voice',
        main: () => <VoiceChatPanel />
      }
    ],
    []
  );

  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  const selectedTab = tabs[selectedTabIndex];

  const handleClose = useCallback(async () => {
    if (agoraStore.hasJoined) {
      await agoraStore.leaveVoiceChat();
    }

    socialStore.widget.close();
  }, [agoraStore, socialStore.widget]);

  return (
    <Portal>
      <styled.Modal>
        <styled.Container>
          <styled.Header>
            <styled.HeaderItemsGroup>
              <IconSvg name="collaboration" size="large" />
              <Heading label="Social" transform="uppercase" type="h2" />
            </styled.HeaderItemsGroup>
            <styled.HeaderItemsGroup>
              <SvgButton iconName="close" size="small" onClick={handleClose} />
            </styled.HeaderItemsGroup>
          </styled.Header>
          <styled.TabsSelector>
            <SocialTabBar
              selectedTabIndex={selectedTabIndex}
              tabs={tabs}
              onSelect={setSelectedTabIndex}
            />
          </styled.TabsSelector>
          <styled.Body>
            <selectedTab.main />
          </styled.Body>
        </styled.Container>
      </styled.Modal>
    </Portal>
  );
};

export default observer(SocialWidget);
