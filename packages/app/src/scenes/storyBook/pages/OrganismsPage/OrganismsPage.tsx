import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';
import {
  Heading,
  Button,
  Dialog,
  Emoji,
  PageTopBar,
  PanelLayout,
  SearchDropdown,
  Text
} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {VisualSettingsPanel} from 'ui-kit';
import {appVariables} from 'api/constants';

import * as styled from './OrganismsPage.styled';

const emojiSizeUI = 's1';

const OrganismsPage: FC = () => {
  const {themeStore} = useStore();

  const theme = useTheme();

  const [dialog1Shown, setDialog1Shown] = useState<boolean>(false);
  const [dialog2Shown, setDialog2Shown] = useState<boolean>(false);
  const [dialog3Shown, setDialog3Shown] = useState<boolean>(false);
  const [dialog4Shown, setDialog4Shown] = useState<boolean>(false);
  const [dialog5Shown, setDialog5Shown] = useState<boolean>(false);

  const TEXT = 'Explicabo vero nisi deserunt ratione voluptate molestiae eveniet officiis omnis.';

  return (
    <styled.Div>
      <PageTopBar title="«ui-kit»" subtitle="Organisms" />
      <styled.Components>
        <styled.Name>
          <Heading label="Component «Dialog»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Button variant="primary" onClick={() => setDialog1Shown(true)} label="Dialog 1" />
          <Button variant="primary" onClick={() => setDialog2Shown(true)} label="Dialog 2" />
          <Button variant="primary" onClick={() => setDialog3Shown(true)} label="Dialog 3" />
          <Button variant="primary" onClick={() => setDialog4Shown(true)} label="Dialog 4" />
          <Button variant="primary" onClick={() => setDialog5Shown(true)} label="Dialog 5" />
          {dialog1Shown && (
            <Dialog
              title="Some title"
              approveInfo={{title: 'Approve', onClick: () => setDialog1Shown(false)}}
              declineInfo={{title: 'Decline', onClick: () => setDialog1Shown(false)}}
              closeOnBackgroundClick={false}
            >
              <Text text="Lorem Ipsum is simply dummy text." size="m" />
            </Dialog>
          )}
          {dialog2Shown && (
            <Dialog
              title="Some title"
              approveInfo={{title: 'Approve', onClick: () => setDialog2Shown(false)}}
              closeOnBackgroundClick={false}
            >
              <Text text="Lorem Ipsum is simply dummy text." size="m" />
            </Dialog>
          )}
          {dialog3Shown && (
            <Dialog
              title="Some title"
              declineInfo={{title: 'Decline', onClick: () => setDialog3Shown(false)}}
              closeOnBackgroundClick={false}
            >
              <Text text="Lorem Ipsum is simply dummy text." size="m" />
            </Dialog>
          )}
          {dialog4Shown && (
            <Dialog title="Some title" onClose={() => setDialog4Shown(false)}>
              <Text text="Click outside of the dialog to close" size="m" />
            </Dialog>
          )}
          {dialog5Shown && (
            <Dialog
              title="Some title"
              onClose={() => setDialog5Shown(false)}
              closeOnBackgroundClick={false}
              showCloseButton
            >
              <Text text="Lorem Ipsum is simply dummy text." size="m" />
            </Dialog>
          )}
        </styled.Section>

        <styled.Name>
          <Heading label="Component «PageTopBar»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid2>
          <PageTopBar title="Calendar" subtitle="calendar" onClose={() => {}} />
          <PageTopBar title="Calendar" subtitle="calendar" />
          <PageTopBar title="Calendar" onClose={() => {}} />
          <PageTopBar title="Calendar" onClose={() => {}}>
            <Button variant="primary" onClick={() => {}} label="Action 1" />
          </PageTopBar>
        </styled.SectionGrid2>

        <styled.Name>
          <Heading label="Component «PanelLayout»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <PanelLayout title="Some title" headerIconName="star" headerStyle="divider-uppercase">
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title" headerStyle="divider-uppercase">
            <Text text={TEXT} size="s" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title" headerStyle="divider-uppercase" onClose={() => {}}>
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title" headerIconName="star" onClose={() => {}}>
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title" onClose={() => {}}>
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title" headerStyle="uppercase" onClose={() => {}}>
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title" headerIconName="star">
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title" headerStyle="uppercase">
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout title="Some title">
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
          <PanelLayout onClose={() => {}}>
            <Text text={TEXT} size="xs" align="left" />
          </PanelLayout>
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «SearchDropdown»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <SearchDropdown
            setIsFocused={() => {}}
            data={[]}
            ButtonLabel="LabelButton"
            onClick={() => {}}
            value=""
            isFocused={false}
            setValue={() => {}}
            search={() => {}}
            searchInputLabel="InputLabel"
            searchInputPlaceholder="InputPlaceholder"
            onButtonClick={() => {}}
          />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «VisualSettingsPanel»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <VisualSettingsPanel
            theme={theme}
            onAccentColorSelect={themeStore.changeAccentColor}
            onBackgroundColorSelect={themeStore.changeBackgroundColor}
          />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «Emoji»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Emoji
            emoji={`${appVariables.RENDER_SERVICE_URL}/texture/${emojiSizeUI}/252878348593caa0f3389bf0c2fc40bd`}
            name="Thumbs Up"
            onClick={() => {}}
          />
          <Emoji
            emoji={`${appVariables.RENDER_SERVICE_URL}/texture/${emojiSizeUI}/350c3860dd6534ae6a5949f9ad724b4d`}
            name="Wave"
            onClick={() => {}}
          />
          <Emoji
            emoji={`${appVariables.RENDER_SERVICE_URL}/texture/${emojiSizeUI}/a9bf62a8d9a82dda112f11bd3ee5ff62`}
            name="Celebration"
            onClick={() => {}}
          />
          <Emoji
            emoji={`${appVariables.RENDER_SERVICE_URL}/texture/${emojiSizeUI}/241ff23317b993dea75ee3642468f1f9`}
            name="Cheers"
            onClick={() => {}}
          />
        </styled.Section>
      </styled.Components>
    </styled.Div>
  );
};

export default OrganismsPage;
