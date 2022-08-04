import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {useTheme} from 'styled-components';
import {useTranslation} from 'react-i18next';
import {toast} from 'react-toastify';

import {
  Avatar,
  Button,
  Heading,
  IconSvg,
  Text,
  FileUploader,
  NavigationBar,
  NavigationBarItem,
  Dropdown,
  ToastMessage,
  Tooltip,
  SvgButton,
  PanelLayout,
  SizeType,
  ToastContent,
  Dialog,
  VisualSettingsPanel,
  TextArea,
  Input,
  SearchInput,
  PageTopBar,
  TabBar,
  TabBarTabInterface,
  InputDark,
  TextAreaDark,
  TOAST_COMMON_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS
} from 'ui-kit';
import {useStore} from 'shared/hooks';
import {appVariables} from 'api/constants';
import {StakingWidget} from 'scenes/widgets/pages';
import {ValidatorList} from 'scenes/widgets/pages/StakingWidget/components/templates/Validators/components/ValidatorList';
import {UserStatusEnum} from 'core/enums';

import * as styled from './StoryBookPage.styled';

interface TabInterface {
  path: string;
  iconName: IconName;
}

const StoryBookPage: FC = () => {
  // FIXME: Temp stuff. Remove it later
  const {mainStore, systemStore} = useStore();
  const {themeStore} = mainStore;
  const {changeAccentColor, changeBackgroundColor} = themeStore;
  const {dialogOne, dialogTwo, dialogThree, dialogFour, dialogFive} = systemStore.storyBookStore;

  const avatarExampleSrc =
    appVariables.RENDER_SERVICE_URL + '/get/2c192ae7cf19a1a782258d07278af61b';
  const exampleFileUploadMaxSize = 10 * Math.pow(2, 20);

  const {t} = useTranslation();
  const theme = useTheme();

  const {widgetStore} = useStore();
  const {stakingStore} = widgetStore;
  const {stakingDialog} = stakingStore;

  const svgSize: SizeType = 'large';

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
        <styled.SectionTitle>Theme Control</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <VisualSettingsPanel
              theme={theme}
              onAccentColorSelect={changeAccentColor}
              onBackgroundColorSelect={changeBackgroundColor}
            />
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Components</styled.SectionTitle>
        <styled.Row>
          <styled.Item style={{width: '100%'}}>
            <Button
              variant="primary"
              onClick={() => stakingDialog.open()}
              theme={theme}
              label="Open Staking"
            />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item style={{width: '100%'}}>
            <PanelLayout
              theme={theme}
              title="Example of the validator list"
              headerStyle="divider-uppercase"
            >
              <ValidatorList
                columnHeaders={[
                  {
                    key: 'isBookmarked',
                    icon: 'star',
                    sortable: false,
                    eventName: 'bookmark',
                    isSmall: true
                  },
                  {key: 'entity', label: 'entity nam', sortable: true},
                  {
                    key: 'selected',
                    label: '',
                    sortable: false,
                    eventName: 'selected',
                    isSmall: true
                  },
                  {key: 'validator', label: 'validator', sortable: true},
                  {key: 'comission', label: 'comission', sortable: true},
                  {key: 'reward', label: 'reward', sortable: true},
                  {key: 'info', sortable: false, eventName: 'info', isSmall: true},
                  {key: 'link', sortable: false, eventName: 'link', isSmall: true}
                ]}
                data={[]}
                onEventClick={(eventName, item) => {
                  console.info('eventclick', [eventName, item]);
                }}
              />
            </PanelLayout>
          </styled.Item>
        </styled.Row>

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
            <Heading theme={theme} type="h1" label="Heading 1 normal" weight="normal" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h1" label="Heading 1 bold" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h1" label="Heading 1 bolder" weight="bolder" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h1" label="Heading 1 light" weight="light" />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Heading theme={theme} type="h2" label="Heading 2 normal" weight="normal" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h2" label="Heading 2 bold" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h2" label="Heading 2 bolder" weight="bolder" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h2" label="Heading 2 light" weight="light" />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Heading theme={theme} type="h3" label="Heading 3 normal" weight="normal" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h3" label="Heading 3 bold" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h3" label="Heading 3 bolder" weight="bolder" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h3" label="Heading 3 light" weight="light" />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Heading theme={theme} type="h4" label="Heading 4 normal" weight="normal" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h4" label="Heading 4 bold" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h4" label="Heading 4 bolder" weight="bolder" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h4" label="Heading 4 light" weight="light" />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Heading theme={theme} type="h5" label="Heading 5 normal" weight="normal" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h5" label="Heading 5 bold" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h5" label="Heading 5 bolder" weight="bolder" />
          </styled.Item>
          <styled.Item>
            <Heading theme={theme} type="h5" label="Heading 5 light" weight="light" />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Text theme={theme} text="Text with size xxs" size="xxs" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Text with size xs" size="xs" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Text with size s" size="s" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Text with size m" size="m" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Text with size l" size="l" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Text with size xl" size="xl" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Normal Text" size="xl" transform="normal" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Uppercase Text" size="xl" transform="uppercase" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="Lowercase Text" size="xl" transform="lowercase" />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Text theme={theme} text="left aligned Text" size="xl" align="left" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="right aligned Text" size="xl" align="right" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="bold Text" size="xl" weight="bold" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="bolder Text" size="xl" weight="bolder" />
          </styled.Item>
          <styled.Item>
            <Text theme={theme} text="light Text" size="xl" weight="light" />
          </styled.Item>
          <styled.Item>
            <styled.Div className="sampleWidth">
              <Text
                theme={theme}
                text="Multiline text with very long text with 480 px width"
                size="m"
                isMultiline={true}
              />
              <Text
                theme={theme}
                text="Single-line text with very long text with 480 px width"
                size="m"
                isMultiline={false}
              />
            </styled.Div>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Button variant="primary" size="normal" label={t('actions.joinStage')} theme={theme} />
          </styled.Item>
          <styled.Item>
            <Button
              variant="primary"
              size="normal"
              label={t('actions.joinStage')}
              theme={theme}
              disabled
            />
          </styled.Item>
          <styled.Item>
            <Button variant="danger" size="normal" label={t('actions.decline')} />
          </styled.Item>
          <styled.Item>
            <Button variant="danger" size="normal" label={t('actions.decline')} disabled />
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
            <styled.AvatarImageUpload>
              <FileUploader
                label={t('fileUploader.uploadLabel')}
                dragActiveLabel={t('fileUploader.dragActiveLabel')}
                fileType="image"
                theme={theme}
                onFilesUpload={console.info}
                maxSize={exampleFileUploadMaxSize}
                onError={(error) => console.error(error)}
              />
            </styled.AvatarImageUpload>
          </styled.Item>
          <styled.Item>
            <styled.TileImageUpload>
              <FileUploader
                label={t('fileUploader.uploadLabel')}
                dragActiveLabel={t('fileUploader.dragActiveLabel')}
                fileType="image"
                theme={theme}
                onFilesUpload={console.info}
                maxSize={exampleFileUploadMaxSize}
              />
            </styled.TileImageUpload>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <IconSvg name="clock" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="copy" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="profile" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="whitelist" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="email" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="alert" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="astro" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="bell" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="bellRed" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="calendar" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="cameraOn" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="cameraOff" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="chart" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="chat" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="check" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="checkmark" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="close" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="drive" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="edit" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="exit" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="explore" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="fullscreen" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="gear" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="group" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="groupChat" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="kusama" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="leave" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="lightbulb" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="lightningDuotone" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="lightningOutline" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="link" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="locate" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="location" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="meeting" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="microphoneOff" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="microphoneOn" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="minimap" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="miro" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="music" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="planet" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="question" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="screenshare" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="search" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="stage" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="star" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="starOn" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="stats" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="tiles" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="wallet" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="warning" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="chevron" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="sort" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="sortOnAsc" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="sortOnDesc" theme={theme} size={svgSize} />
          </styled.Item>
          <styled.Item>
            <IconSvg name="shieldCheck" theme={theme} size={svgSize} />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <Tooltip label="The Tooltip" placement="bottom" visible={true}>
              <Button variant="danger" size="normal" label="Decline" />
            </Tooltip>
          </styled.Item>
          <styled.Item>
            <Tooltip label="Music Player" placement="top" visible={true}>
              <Button variant="danger" size="normal" label="Decline" />
            </Tooltip>
          </styled.Item>
          <styled.Space />
          <styled.Item>
            <Tooltip label="Information" placement="left" visible={true}>
              <Button variant="danger" size="normal" label="Decline" />
            </Tooltip>
          </styled.Item>
          <styled.Item>
            <Tooltip label="Share Location" placement="right" visible={true}>
              <Button variant="primary" size="normal" label="Join stage" theme={theme} />
            </Tooltip>
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <SvgButton
              theme={theme}
              iconName="close"
              size="small"
              onClick={() => console.info('clicked')}
            />
          </styled.Item>
          <styled.Item>
            <SvgButton
              theme={theme}
              iconName="close"
              size="normal"
              onClick={() => console.info('clicked')}
            />
          </styled.Item>
          <styled.Item>
            <SvgButton
              theme={theme}
              iconName="close"
              size="large"
              onClick={() => console.info('clicked')}
            />
          </styled.Item>
          <styled.Item>
            <SvgButton
              theme={theme}
              iconName="close"
              size="extra-large"
              onClick={() => console.info('clicked')}
            />
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
              onClick={() => dialogOne.open()}
              theme={theme}
              label="Click to open"
            />
            {dialogOne.isOpen && (
              <Dialog
                title="Some title"
                approveInfo={{title: 'Approve', onClick: dialogOne.close}}
                declineInfo={{title: 'Decline', onClick: dialogOne.close}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with accept button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => dialogTwo.open()}
              theme={theme}
              label="Click to open"
            />
            {dialogTwo.isOpen && (
              <Dialog
                title="Some title"
                approveInfo={{title: 'Approve', onClick: dialogTwo.close}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with decline button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => dialogThree.open()}
              theme={theme}
              label="Click to open"
            />
            {dialogThree.isOpen && (
              <Dialog
                title="Some title"
                declineInfo={{title: 'Decline', onClick: dialogThree.close}}
                closeOnBackgroundClick={false}
              />
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with no buttons and background close</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => dialogFour.open()}
              theme={theme}
              label="Click to open"
            />
            {dialogFour.isOpen && (
              <Dialog title="Some title" onClose={dialogFour.close}>
                <Text theme={theme} text="Click outside of the dialog to close" size="m" />
              </Dialog>
            )}
          </styled.Item>
          <styled.Item>
            <styled.ItemName>Dialog with close button</styled.ItemName>
            <Button
              variant="primary"
              onClick={() => dialogFive.open()}
              theme={theme}
              label="Click to open"
            />
            {dialogFive.isOpen && (
              <Dialog
                title="Some title"
                onClose={dialogFive.close}
                closeOnBackgroundClick={false}
                showCloseButton
              />
            )}
          </styled.Item>
        </styled.Row>
      </styled.Section>
      <styled.Section>
        <styled.SectionTitle>Inputs</styled.SectionTitle>
        <styled.Row>
          <styled.Item>
            <Input label="Token Name" placeholder="Type Here Token Name" />
          </styled.Item>
          <styled.Item>
            <Input label="Token Name" placeholder="Type Here Token Name" selected />
          </styled.Item>
          <styled.Item>
            <Input label="Token Name" placeholder="You cannot change the token name" disabled />
          </styled.Item>
          <styled.Item>
            <InputDark />
          </styled.Item>
        </styled.Row>
        <styled.Row>
          <styled.Item>
            <TextArea name="Label" placeholder="Placeholder..." lines={3} lineLength={30} />
          </styled.Item>
          <styled.Item>
            <TextArea name="Label" placeholder="Placeholder..." selected />
          </styled.Item>
          <styled.Item>
            <TextArea name="Label" value="Hello this is a disabled TextArea" disabled />
          </styled.Item>
          <styled.Item>
            <TextAreaDark rows={3} />
          </styled.Item>
        </styled.Row>
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
      {stakingDialog.isOpen && <StakingWidget />}
    </styled.Div>
  );
};

export default observer(StoryBookPage);
