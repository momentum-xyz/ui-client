import React, {FC, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';

import {
  Avatar,
  Button,
  Text,
  NavigationBar,
  NavigationBarItem,
  Dropdown,
  ToastMessage,
  SvgButton,
  PanelLayout,
  ToastContent,
  Dialog,
  TextArea,
  Input,
  SearchInput,
  PageTopBar,
  TabBar,
  TabBarTabInterface,
  TOAST_COMMON_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';
import {appVariables} from 'api/constants';
import {UserStatusEnum} from 'core/enums';

import * as styled from './StoryBookPage.styled';

interface TabInterface {
  path: string;
  iconName: IconName;
}

const StoryBookPage: FC = () => {
  const [dialog1Shown, setDialog1Shown] = useState<boolean>(false);
  const [dialog2Shown, setDialog2Shown] = useState<boolean>(false);
  const [dialog3Shown, setDialog3Shown] = useState<boolean>(false);
  const [dialog4Shown, setDialog4Shown] = useState<boolean>(false);
  const [dialog5Shown, setDialog5Shown] = useState<boolean>(false);

  const avatarExampleSrc =
    appVariables.RENDER_SERVICE_URL + '/get/2c192ae7cf19a1a782258d07278af61b';

  const theme = useTheme();

  const successtoast = () => {
    toast.success('Explicabo vero nisi deserunt ratione voluptate', {
      closeOnClick: true,
      autoClose: 5000
    });
  };

  const warningtoast = () => {
    toast.warning('Request has not been made at the moment, try again later');
  };

  const customtoasterror = () => {
    toast.error(
      <ToastContent
        isDanger
        headerIconName="calendar"
        title="Alert"
        text="some text"
        isCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );
  };

  const customtoastinfo = () => {
    toast.info(
      <ToastContent
        headerIconName="alert"
        title="Alert"
        text="some text here not more"
        isCloseButton
      />,
      TOAST_COMMON_OPTIONS
    );
  };

  const customtoastinfoButton = () => {
    toast.info(
      <ToastContent
        headerIconName="alert"
        text="Explicabo vero nisi deserunt."
        theme={theme}
        title="Alert Title"
        approveInfo={{title: 'ok', onClick: () => console.info('ok')}}
        declineInfo={{title: 'cancel', onClick: () => console.info('cancel')}}
      />,
      TOAST_NOT_AUTO_CLOSE_OPTIONS
    );
  };

  const tabs: TabInterface[] = [
    {
      path: 'dashboard',
      iconName: 'tiles'
    },
    {
      path: 'stage-mode',
      iconName: 'stage'
    },
    {
      path: 'screenshare',
      iconName: 'screenshare'
    },
    {
      path: 'miro',
      iconName: 'miro'
    },
    {
      path: 'google-drive',
      iconName: 'drive'
    }
  ];

  const tabBarTabs: TabBarTabInterface[] = [
    {
      id: '1',
      title: 'Test this please 1',
      label: '1. My wallet longer text even longer',
      icon: 'wallet'
    },
    {id: '2', title: 'Test this please 1', label: 'test 2'},
    {id: '3', title: 'Test this please 1', label: 'test 3'},
    {id: '4', title: 'Test this please 1', label: 'test 4'},
    {id: '5', title: 'Test this please 1', label: 'test 5'}
  ];

  return (
    <styled.Div className="main">
      <styled.Section>
        <styled.SectionTitle>Components</styled.SectionTitle>

        <styled.Row>
          <styled.Item>
            <NavigationBar>
              {tabs.map((tab) => (
                <NavigationBarItem
                  key={tab.path}
                  iconName={tab.iconName}
                  path={`/system/storybook/${tab.path}`}
                />
              ))}
            </NavigationBar>
          </styled.Item>
          <styled.Item style={{width: '100%'}}>
            <PageTopBar
              title="spacename"
              subtitle="calendar"
              theme={theme}
              onClose={() => console.info('Topbar close')}
            />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <PageTopBar
            title="spacename"
            subtitle="calendar"
            theme={theme}
            onClose={() => console.info('Topbar close')}
          >
            <Button variant="danger" label="154 Wows" theme={theme} />
            <Button variant="primary" label="Add Gathering" theme={theme} />
          </PageTopBar>
        </styled.Row>
        <styled.Row>
          <PageTopBar
            title="spacename"
            subtitle="calendar"
            theme={theme}
            actions={
              <>
                <SvgButton iconName="groupChat" size="medium-large" onClick={() => {}} />
              </>
            }
            onClose={() => console.info('Topbar close')}
          >
            <Button variant="danger" label="154 Wows" theme={theme} />
            <Button variant="primary" label="Add Gathering" theme={theme} />
          </PageTopBar>
        </styled.Row>
        <styled.Row>
          <styled.Item style={{width: '100%'}}>
            <TabBar
              tabs={tabBarTabs}
              selectedTab={tabBarTabs[0]}
              onTabSelect={(tab) => console.info(tab)}
            />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Avatar size="small" avatarSrc={avatarExampleSrc} />
          </styled.Item>
          <styled.Item>
            <Avatar size="small" status={UserStatusEnum.ONLINE} avatarSrc={avatarExampleSrc} />
          </styled.Item>
          <styled.Item>
            <Avatar size="normal" status={UserStatusEnum.ONLINE} avatarSrc={avatarExampleSrc} />
          </styled.Item>
          <styled.Item>
            <Avatar
              size="normal"
              status={UserStatusEnum.DO_NOT_DISTURB}
              avatarSrc={avatarExampleSrc}
            />
          </styled.Item>
          <styled.Item>
            <Avatar size="large" avatarSrc={avatarExampleSrc} />
          </styled.Item>
          <styled.Item>
            <Avatar size="large" status={UserStatusEnum.ONLINE} avatarSrc={avatarExampleSrc} />
          </styled.Item>
          <styled.Item>
            <Avatar size="large" />
          </styled.Item>
        </styled.Row>

        <styled.Row>
          <styled.Item>
            <SearchInput
              placeholder="Search for..."
              onChange={(value) => console.info(`Searching for '${value}'`)}
              delay={300}
            />
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Base components</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with uppercase and border title</styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Your Request has been Accepted"
                headerStyle="divider-uppercase"
              >
                <Text text="Would you like to go on stage?" size="s" align="left" />
                <Text
                  text=" (This will enable the you to talk, screenshare, and transmit video)"
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with uppercase title</styled.ItemName>
              <PanelLayout theme={theme} title="Some title" headerStyle="uppercase">
                <Text
                  text="Wait for the moderators to accept or deny your reques"
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>
                Component with uppercase and border title and close button
              </styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerStyle="divider-uppercase"
                onClose={() => console.info('clicked')}
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with uppercase title and close button</styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerStyle="uppercase"
                onClose={() => console.info('clicked')}
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with normal title and close button</styled.ItemName>
              <PanelLayout theme={theme} title="Some title" onClose={() => console.info('clicked')}>
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with normal title</styled.ItemName>
              <PanelLayout theme={theme} title="Some title">
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with close button</styled.ItemName>
              <PanelLayout theme={theme} onClose={() => console.info('clicked')}>
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component without anything</styled.ItemName>
              <PanelLayout theme={theme}>
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with extending content</styled.ItemName>
              <PanelLayout theme={theme} isBodyExtendingToEdges>
                <div style={{background: 'black', width: '100%'}}>Hello</div>
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component without extending content</styled.ItemName>
              <PanelLayout theme={theme}>
                <div style={{background: 'black', width: '100%'}}>Hello</div>
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>Component with normal title and header icon</styled.ItemName>
              <PanelLayout theme={theme} title="Some title" headerIconName="star">
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>
                Component with normal title and header icon and close button
              </styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerIconName="star"
                onClose={() => console.info('clicked')}
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
          <styled.Item>
            <styled.RequestExample>
              <styled.ItemName>
                Component with uppercase and border title and header icon
              </styled.ItemName>
              <PanelLayout
                theme={theme}
                title="Some title"
                headerIconName="star"
                headerStyle="divider-uppercase"
              >
                <Text
                  text="Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis."
                  size="xs"
                  align="left"
                />
              </PanelLayout>
            </styled.RequestExample>
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Dialogs</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <styled.ItemName>Dialog with approve and accept buttons</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog1Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog1Shown && (
              <Dialog
                title="Some title"
                approveInfo={{title: 'Approve', onClick: () => setDialog1Shown(false)}}
                declineInfo={{title: 'Decline', onClick: () => setDialog1Shown(false)}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with accept button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog2Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog2Shown && (
              <Dialog
                title="Some title"
                approveInfo={{title: 'Approve', onClick: () => setDialog2Shown(false)}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with decline button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog3Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog3Shown && (
              <Dialog
                title="Some title"
                declineInfo={{title: 'Decline', onClick: () => setDialog3Shown(false)}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with no buttons and background close</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog4Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog4Shown && (
              <Dialog title="Some title" onClose={() => setDialog4Shown(false)}>
                <Text theme={theme} text="Click outside of the dialog to close" size="m" />
              </Dialog>
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with close button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => setDialog5Shown(true)}
              theme={theme}
              label="Click to open"
            />
            {dialog5Shown && (
              <Dialog
                title="Some title"
                onClose={() => setDialog5Shown(false)}
                closeOnBackgroundClick={false}
                showCloseButton
              />
            )}
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.Row>
          <styled.Item>
            <PanelLayout>
              <styled.InputPanelLayout>
                <Input label="Token Name" placeholder="Type Here Token Name" isCustom />
                <TextArea name="Label" placeholder="Type Here Token Description" isCustom />
              </styled.InputPanelLayout>
            </PanelLayout>
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Dropdown</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <Dropdown
              placeholder="Select an option"
              value="option-6"
              onOptionSelect={(option) => {
                console.info('selection option', option);
              }}
              options={[
                {label: 'option 1', value: 'option-1'},
                {label: 'option 2', value: 'option-2'},
                {label: 'option 3', value: 'option-3'},
                {label: 'option 4', value: 'option-4'}
              ]}
            />
          </styled.Item>
          <styled.Item>
            <Dropdown
              placeholder="Select an option"
              value="option-6"
              variant="secondary"
              onOptionSelect={(option) => {
                console.info('selection option', option);
              }}
              options={[
                {label: 'option 1', value: 'option-1', icon: 'wallet'},
                {label: 'option 2', value: 'option-2', icon: 'wallet'},
                {label: 'option 3', value: 'option-3', icon: 'wallet'},
                {label: 'option 4', value: 'option-4', icon: 'wallet'}
              ]}
            />
          </styled.Item>
          <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} />
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Toast Messages</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <Button variant="primary" size="normal" label="success toast" onClick={successtoast} />
          </styled.Item>
          <styled.Item>
            <Button variant="danger" size="normal" label="warning toast" onClick={warningtoast} />
          </styled.Item>
          <styled.Item>
            <Button
              variant="danger"
              size="normal"
              label="custom error toast"
              onClick={customtoasterror}
            />
          </styled.Item>
          <styled.Item>
            <Button
              variant="primary"
              size="normal"
              label="custom info toast"
              onClick={customtoastinfo}
            />
          </styled.Item>
          <styled.Item>
            <Button
              variant="primary"
              size="normal"
              label="custom info toast"
              onClick={customtoastinfoButton}
            />
          </styled.Item>
        </styled.Row>
      </styled.Section>
    </styled.Div>
  );
};

export default observer(StoryBookPage);
