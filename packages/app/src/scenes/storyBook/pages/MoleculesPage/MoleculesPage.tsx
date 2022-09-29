import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';
import {toast} from 'react-toastify';
import {
  Heading,
  Avatar,
  ColorPicker,
  Dropdown,
  ExpandableLayout,
  FileUploader,
  Location,
  NavigationBarItem,
  NetworkButton,
  SearchInput,
  SectionPanel,
  ShowMoreText,
  Steps,
  SvgButton,
  TabBar,
  TileMenu,
  Toggle,
  ToolbarIcon,
  Button
} from '@momentum/ui-kit';

import {UserStatusEnum} from 'core/enums';
import {
  AccentColorList,
  PageTopBar,
  ToastContent,
  TOAST_COMMON_OPTIONS,
  TOAST_NOT_AUTO_CLOSE_OPTIONS,
  ToastMessage
} from 'ui-kit';
import walletConnect from 'static/images/walletConnect.svg';
import polkadot from 'static/images/polkadot.svg';
import metamask from 'static/images/metamask.svg';

import * as styled from './MoleculesPage.styled';

const avatarSrc = 'https://picsum.photos/100';

const MoleculesPage: FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const theme = useTheme();

  return (
    <styled.Div>
      <PageTopBar title="«ui-kit»" subtitle="Molecules" />
      <styled.Components>
        <styled.Name>
          <Heading label="Component «Avatar»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Avatar size="large" />
          <Avatar size="large" avatarSrc={avatarSrc} />
          <Avatar size="large" status={UserStatusEnum.ONLINE} avatarSrc={avatarSrc} />
          <Avatar size="large" status={UserStatusEnum.DO_NOT_DISTURB} avatarSrc={avatarSrc} />
          <Avatar size="normal" />
          <Avatar size="normal" avatarSrc={avatarSrc} />
          <Avatar size="normal" status={UserStatusEnum.ONLINE} avatarSrc={avatarSrc} />
          <Avatar size="normal" status={UserStatusEnum.DO_NOT_DISTURB} avatarSrc={avatarSrc} />
          <Avatar size="small" />
          <Avatar size="small" status={UserStatusEnum.ONLINE} />
          <Avatar size="small" status={UserStatusEnum.DO_NOT_DISTURB} />
          <Avatar size="small" avatarSrc={avatarSrc} />
          <Avatar size="small" status={UserStatusEnum.ONLINE} avatarSrc={avatarSrc} />
          <Avatar size="small" status={UserStatusEnum.DO_NOT_DISTURB} avatarSrc={avatarSrc} />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «ColorPicker»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <ColorPicker
            name="Accent Color"
            selectedColor={theme.accent}
            colors={AccentColorList}
            onColorSelect={() => {}}
            theme={theme}
          />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «Dropdown»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <Dropdown
            placeholder="Primary select ..."
            onOptionSelect={() => {}}
            options={[
              {label: 'option 1', value: 'option-1'},
              {label: 'option 2', value: 'option-2'},
              {label: 'option 3', value: 'option-3'}
            ]}
          />
          <Dropdown
            placeholder="Secondary select ..."
            variant="secondary"
            onOptionSelect={() => {}}
            options={[
              {label: 'option 1', value: 'option-1', icon: 'star'},
              {label: 'option 2', value: 'option-2', icon: 'search'},
              {label: 'option 3', value: 'option-3', icon: 'starOn'}
            ]}
          />
          <Dropdown
            placeholder="Secondary select ..."
            variant="secondary"
            onOptionSelect={() => {}}
            options={[
              {label: 'option 1', value: 'option-1'},
              {label: 'option 2', value: 'option-2'},
              {label: 'option 3', value: 'option-3'}
            ]}
          />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «ExpandableLayout»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <ExpandableLayout
            name="People"
            iconName="people"
            isExpanded={expanded}
            setExpand={() => setExpanded(!expanded)}
            size={{width: '250px'}}
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book.
          </ExpandableLayout>
        </styled.Section>

        <styled.Name>
          <Heading label="Component «FileUploader»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <styled.AvatarImageUpload>
            <FileUploader
              label="Upload Image"
              dragActiveLabel="Drop the files here..."
              fileType="image"
              onFilesUpload={(file) => console.log(file)}
              maxSize={10 * Math.pow(2, 20)}
              onError={(error) => console.error(error)}
              enableDragAndDrop={false}
            />
          </styled.AvatarImageUpload>
          <styled.TileImageUpload>
            <FileUploader
              label="Upload Image"
              dragActiveLabel="Drop the files here..."
              fileType="image"
              onFilesUpload={console.info}
              maxSize={10 * Math.pow(2, 20)}
              onError={(error) => console.error(error)}
              enableDragAndDrop={false}
            />
          </styled.TileImageUpload>
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Location»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <Location icon="locate" value={avatarSrc} />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «NavigationBarItem»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <NavigationBarItem iconName="tiles" path="" />
          <NavigationBarItem iconName="miro" path="" />
          <NavigationBarItem iconName="drive" path="" />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «NetworkButton»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <NetworkButton imageSrc={metamask} label="Metamask" onClick={() => {}} />
          <NetworkButton imageSrc={polkadot} label="Polkadot" onClick={() => {}} />
          <NetworkButton imageSrc={walletConnect} label="Wallet" onClick={() => {}} />
          <NetworkButton iconName="profile" label="Guest" onClick={() => {}} />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «SearchInput»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <SearchInput placeholder="Search for..." onChange={(value) => {}} delay={300} />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «SectionPanel»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <SectionPanel title="Section panel">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book.
          </SectionPanel>
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «ShowMoreText»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <ShowMoreText
            text="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard dummy text ever since the 1500s, when an unknown
            printer took a galley of type and scrambled it to make a type specimen book."
            textProps={{size: 's', align: 'left', firstBoldSentences: 1}}
          />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «SvgButton»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <SvgButton iconName="gear" size="extra-large" onClick={() => {}} />
          <SvgButton iconName="gear" size="large" onClick={() => {}} />
          <SvgButton iconName="gear" size="medium-large" onClick={() => {}} />
          <SvgButton iconName="gear" size="normal" onClick={() => {}} />
          <SvgButton iconName="gear" size="small" onClick={() => {}} />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «TabBar»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid2>
          <TabBar
            tabs={[
              {id: '1', title: '1', label: 'Tab 1', icon: 'wallet'},
              {id: '2', title: '2', label: 'Tab 2', icon: 'star'},
              {id: '3', title: '3', label: 'Tab 3', icon: 'starOn'},
              {id: '4', title: '4', label: 'Tab 4', icon: 'music'},
              {id: '5', title: '5', label: 'Tab 5', icon: 'gear'}
            ]}
            selectedTab={{id: '1', title: '1', label: 'test 1', icon: 'wallet'}}
            onTabSelect={() => {}}
          />
          <TabBar
            tabs={[
              {id: '1', title: '1', label: 'Tab 1'},
              {id: '2', title: '2', label: 'Tab 2'},
              {id: '3', title: '3', label: 'Tab 3'},
              {id: '4', title: '4', label: 'Tab 4'},
              {id: '5', title: '5', label: 'Tab 5'}
            ]}
            selectedTab={{id: '1', title: '1', label: 'test 1'}}
            onTabSelect={() => {}}
          />
        </styled.SectionGrid2>

        <styled.Name>
          <Heading label="Component «TileMenu»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <TileMenu onEdit={() => {}} onDelete={() => {}} isDelete />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «ToastContent»" type="h2" align="left" />
          <ToastMessage position={toast.POSITION.BOTTOM_RIGHT} />
        </styled.Name>
        <styled.SectionGrid2>
          <ToastContent
            isDanger
            headerIconName="calendar"
            title="Alert"
            text="Some text"
            showCloseButton
          />
          <ToastContent
            headerIconName="alert"
            title="Alert"
            text="Some text here not more"
            showCloseButton
          />
        </styled.SectionGrid2>
        <styled.SectionGrid2>
          <ToastContent
            headerIconName="alert"
            text="Some text here not more"
            title="Alert Title"
            approveInfo={{title: 'ok', onClick: () => {}}}
            declineInfo={{title: 'cancel', onClick: () => {}}}
          />
          <ToastContent
            isDanger
            headerIconName="alert"
            text="Some text here not more"
            title="Alert Title"
            approveInfo={{title: 'ok', onClick: () => {}}}
            declineInfo={{title: 'cancel', onClick: () => {}}}
          />
        </styled.SectionGrid2>
        <styled.SectionGrid2>
          <ToastContent
            headerIconName="alert"
            text="Some text here not more"
            title="Alert Title"
            approveInfo={{title: 'ok', onClick: () => {}}}
          />
          <ToastContent
            isDanger
            headerIconName="alert"
            text="Some text here not more"
            title="Alert Title"
            declineInfo={{title: 'cancel', onClick: () => {}}}
          />
        </styled.SectionGrid2>
        <styled.Section>
          <Button
            variant="primary"
            size="normal"
            label="Info toast"
            onClick={() => {
              toast.info(
                <ToastContent
                  headerIconName="alert"
                  title="Alert"
                  text="some text here not more"
                  showCloseButton
                />,
                TOAST_COMMON_OPTIONS
              );
            }}
          />
          <Button
            variant="primary"
            size="normal"
            label="Info toast with buttons"
            onClick={() => {
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
            }}
          />
          <Button
            variant="danger"
            size="normal"
            label="Error toast"
            onClick={() => {
              toast.error(
                <ToastContent
                  isDanger
                  headerIconName="calendar"
                  title="Alert"
                  text="some text"
                  showCloseButton
                />,
                TOAST_COMMON_OPTIONS
              );
            }}
          />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Toggle»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Toggle size="normal" variant="normal" checked={checked} onChange={setChecked} />
          <Toggle size="normal" variant="availability" checked={checked} onChange={setChecked} />
          <Toggle size="normal" variant="availability" checked disabled onChange={() => {}} />
          <Toggle size="small" variant="normal" checked={checked} onChange={setChecked} />
          <Toggle size="small" variant="availability" checked={checked} onChange={setChecked} />
          <Toggle
            size="small"
            variant="availability"
            checked={false}
            disabled
            onChange={() => {}}
          />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «ToolbarIcon»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <ToolbarIcon title="StarOn" icon="starOn" onClick={() => {}} isWhite={false} />
          <ToolbarIcon title="Chat" icon="chat" onClick={() => {}} isWhite={false} />
          <ToolbarIcon title="StarOn" icon="starOn" onClick={() => {}} />
          <ToolbarIcon title="Chat" icon="chat" onClick={() => {}} />
        </styled.Section>
        <styled.Name>
          <Heading label="Component «Steps»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <styled.CenteredItem>
            <Steps steps={['Step 1', 'Step 2', 'Step 3']} />
          </styled.CenteredItem>
          <styled.CenteredItem>
            <Steps currentStep={0} steps={['Step 1', 'Step 2', 'Step 3']} />
          </styled.CenteredItem>
          <styled.CenteredItem>
            <Steps currentStep={1} steps={['Step 1', 'Step 2', 'Step 3']} />
          </styled.CenteredItem>
          <styled.CenteredItem>
            <Steps currentStep={4} steps={['Step 1', 'Step 2', 'Step 3']} />
          </styled.CenteredItem>
        </styled.Section>
      </styled.Components>
    </styled.Div>
  );
};

export default MoleculesPage;
