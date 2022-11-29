import {Heading, IconSvg, SvgButton} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {FC, useMemo, useState} from 'react';

import {SocialTabBar} from './components';
import * as styled from './SocialPanel.styled';

interface SocialPanelTabInterface {
  name: string;
  main: () => JSX.Element | null;
}

const Chat: FC = () => {
  return <div>Chat</div>;
};

const Voice: FC = () => {
  return <div>Voice</div>;
};

const SocialPanel: FC = () => {
  const tabs: SocialPanelTabInterface[] = useMemo(
    () => [
      {
        name: 'Chat',
        main: () => <Chat />
      },
      {
        name: 'Voice',
        main: () => <Voice />
      }
    ],
    []
  );

  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  const selectedTab = useMemo(() => tabs[selectedTabIndex], [selectedTabIndex, tabs]);

  return (
    <styled.Container>
      <styled.Header>
        <styled.HeaderItemsGroup>
          <IconSvg name="chat" /> <Heading label="Social" transform="uppercase" type="h3" />
        </styled.HeaderItemsGroup>
        <styled.HeaderItemsGroup>
          <SvgButton iconName="close" size="normal" />
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
  );
};

export default observer(SocialPanel);
