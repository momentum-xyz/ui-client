import React, {FC, useState} from 'react';
import {useTheme} from 'styled-components';

import {useStore} from 'shared/hooks';
import {
  Button,
  Dialog,
  Heading,
  PageTopBar,
  PanelLayout,
  SearchDropdown,
  Text,
  VisualSettingsPanel
} from 'ui-kit';

import * as styled from './OrganismsPage.styled';

const OrganismsPage: FC = () => {
  const {themeStore} = useStore().mainStore;

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
      </styled.Components>
    </styled.Div>
  );
};

export default OrganismsPage;
