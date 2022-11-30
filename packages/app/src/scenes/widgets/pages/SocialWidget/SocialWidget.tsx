import {Heading, IconSvg, Portal, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useCallback, useMemo, useState} from 'react';

import {useStore} from 'shared/hooks';

import {SocialTabBar, VoicePanel} from './components';
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
        main: () => <VoicePanel />
      }
    ],
    []
  );

  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  const selectedTab = useMemo(() => tabs[selectedTabIndex], [selectedTabIndex, tabs]);

  const handleClose = useCallback(async () => {
    if (agoraStore.hasJoined) {
      await agoraStore.leave();
    }

    socialStore.widget.close();
  }, [agoraStore, socialStore.widget]);

  return (
    <Portal>
      <styled.Modal>
        <styled.Container>
          <styled.Header>
            <styled.HeaderItemsGroup>
              <IconSvg name="chat" /> <Heading label="Social" transform="uppercase" type="h3" />
            </styled.HeaderItemsGroup>
            <styled.HeaderItemsGroup>
              <SvgButton iconName="close" size="normal" onClick={handleClose} />
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
