import React, {FC} from 'react';
import {
  Heading,
  Button,
  IconSvg,
  Input,
  Message,
  Loader,
  InputDark,
  ProgressBar,
  Separator,
  Text,
  TextArea,
  TextAreaDark,
  ToolbarIconList,
  Tooltip,
  PageTopBar,
  ToolbarIcon
} from '@momentum-xyz/ui-kit';

import * as styled from './AtomsPage.styled';

const AtomsPage: FC = () => {
  return (
    <styled.Div>
      <PageTopBar title="«ui-kit»" subtitle="Atoms" />
      <styled.Components>
        <styled.Name>
          <Heading label="Component «IconSvg»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <IconSvg size="large" name="add" />
          <IconSvg size="large" name="add" />
          <IconSvg size="large" name="airport-signal" />
          <IconSvg size="large" name="alert" />
          <IconSvg size="large" name="approved" />
          <IconSvg size="large" name="arrowLeftBig" />
          <IconSvg size="large" name="arrow-keys" />
          <IconSvg size="large" name="arrow" />
          <IconSvg size="large" name="astro" />
          <IconSvg size="large" name="bell" />
          <IconSvg size="large" name="bellRed" />
          <IconSvg size="large" name="bin" />
          <IconSvg size="large" name="calendar" />
          <IconSvg size="large" name="calendarMinus" />
          <IconSvg size="large" name="cameraOff" />
          <IconSvg size="large" name="cameraOn" />
          <IconSvg size="large" name="chart" />
          <IconSvg size="large" name="chat" />
          <IconSvg size="large" name="check-on" />
          <IconSvg size="large" name="check" />
          <IconSvg size="large" name="checkmark" />
          <IconSvg size="large" name="chevron" />
          <IconSvg size="large" name="clock" />
          <IconSvg size="large" name="close" />
          <IconSvg size="large" name="collaboration" />
          <IconSvg size="large" name="controls" />
          <IconSvg size="large" name="copy" />
          <IconSvg size="large" name="cube" />
          <IconSvg size="large" name="denied" />
          <IconSvg size="large" name="direction-arrows" />
          <IconSvg size="large" name="discord" />
          <IconSvg size="large" name="drive" />
          <IconSvg size="large" name="edit" />
          <IconSvg size="large" name="email" />
          <IconSvg size="large" name="exit" />
          <IconSvg size="large" name="explore" />
          <IconSvg size="large" name="fly-to" />
          <IconSvg size="large" name="fullscreen" />
          <IconSvg size="large" name="gear" />
          <IconSvg size="large" name="group" />
          <IconSvg size="large" name="groupChat" />
          <IconSvg size="large" name="hand" />
          <IconSvg size="large" name="home" />
          <IconSvg size="large" name="info" />
          <IconSvg size="large" name="invite-user" />
          <IconSvg size="large" name="kusama" />
          <IconSvg size="large" name="leave" />
          <IconSvg size="large" name="lightbulb" />
          <IconSvg size="large" name="lightningDuotone" />
          <IconSvg size="large" name="lightningOutline" />
          <IconSvg size="large" name="link" />
          <IconSvg size="large" name="live" />
          <IconSvg size="large" name="locate" />
          <IconSvg size="large" name="location" />
          <IconSvg size="large" name="lock" />
          <IconSvg size="large" name="logout" />
          <IconSvg size="large" name="meeting" />
          <IconSvg size="large" name="microphoneOff" />
          <IconSvg size="large" name="microphoneOn" />
          <IconSvg size="large" name="minimap" />
          <IconSvg size="large" name="miro" />
          <IconSvg size="large" name="mouse-pad" />
          <IconSvg size="large" name="music" />
          <IconSvg size="large" name="notes" />
          <IconSvg size="large" name="pencil" />
          <IconSvg size="large" name="people" />
          <IconSvg size="large" name="planet" />
          <IconSvg size="large" name="play-button" />
          <IconSvg size="large" name="player-backward" />
          <IconSvg size="large" name="player-forward" />
          <IconSvg size="large" name="player-mute" />
          <IconSvg size="large" name="player-pause" />
          <IconSvg size="large" name="player-unmute" />
          <IconSvg size="large" name="polkadotprofile" />
          <IconSvg size="large" name="profile" />
          <IconSvg size="large" name="question" />
          <IconSvg size="large" name="questions" />
          <IconSvg size="large" name="qweasd" />
          <IconSvg size="large" name="remove-user" />
          <IconSvg size="large" name="requested" />
          <IconSvg size="large" name="rocket" />
          <IconSvg size="large" name="screenshare" />
          <IconSvg size="large" name="search" />
          <IconSvg size="large" name="shieldCheck" />
          <IconSvg size="large" name="shift-button" />
          <IconSvg size="large" name="smiley-face" />
          <IconSvg size="large" name="sort" />
          <IconSvg size="large" name="sortOnAsc" />
          <IconSvg size="large" name="sortOnDesc" />
          <IconSvg size="large" name="space-bar" />
          <IconSvg size="large" name="stage" />
          <IconSvg size="large" name="star" />
          <IconSvg size="large" name="starOn" />
          <IconSvg size="large" name="stats" />
          <IconSvg size="large" name="stop" />
          <IconSvg size="large" name="tiles" />
          <IconSvg size="large" name="trash" />
          <IconSvg size="large" name="vibe" />
          <IconSvg size="large" name="wallet" />
          <IconSvg size="large" name="warning" />
          <IconSvg size="large" name="whitelist" />
          <IconSvg size="large" name="fly-with-me" />
          <IconSvg size="large" name="sound" />
          <IconSvg size="large" name="solar-system" />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «SvgButton»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <IconSvg name="close" size="extra-large" onClick={() => {}} />
          <IconSvg name="close" size="large" onClick={() => {}} />
          <IconSvg name="close" size="medium-large" onClick={() => {}} />
          <IconSvg name="close" size="normal" onClick={() => {}} />
          <IconSvg name="close" size="small" onClick={() => {}} />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Button»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Button variant="primary" size="normal" label="Join Stage" />
          <Button variant="primary-background" size="normal" label="Join Stage" />
          <Button variant="danger" size="normal" label="Join Stage" />
          <Button variant="danger-background" size="normal" label="Join Stage" />
          <Button variant="inverted" size="normal" label="Join Stage" />
          <Button variant="secondary" size="normal" label="Join Stage" />
        </styled.Section>
        <styled.Section>
          <Button variant="primary" size="normal" label="Join Stage" disabled />
          <Button variant="primary-background" size="normal" label="Join Stage" disabled />
          <Button variant="danger" size="normal" label="Join Stage" disabled />
          <Button variant="danger-background" size="normal" label="Join Stage" disabled />
          <Button variant="inverted" size="normal" label="Join Stage" disabled />
          <Button variant="secondary" size="normal" label="Join Stage" disabled />
        </styled.Section>
        <styled.Section>
          <Button variant="primary" size="normal" label="Join Stage" icon="wallet" />
          <Button variant="danger" size="normal" label="Join Stage" icon="wallet" />
          <Button variant="inverted" size="normal" label="Join Stage" icon="wallet" />
          <Button variant="secondary" size="normal" label="Join Stage" icon="wallet" />
        </styled.Section>
        <styled.Section>
          <Button variant="primary" size="normal" label="Join Stage (normal)" />
          <Button variant="primary" size="normal" label="Join Stage" transform="normal" />
          <Button variant="primary" size="medium" label="Join Stage (medium)" />
          <Button variant="primary" size="medium" label="Join Stage" transform="normal" />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Heading»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Heading type="h1" label="Heading 1 normal" weight="normal" />
          <Heading type="h1" label="Heading 1 bold" />
          <Heading type="h1" label="Heading 1 bolder" weight="bolder" />
          <Heading type="h1" label="Heading 1 light" weight="light" />
        </styled.Section>
        <styled.Section>
          <Heading type="h2" label="Heading 2 normal" weight="normal" />
          <Heading type="h2" label="Heading 2 bold" />
          <Heading type="h2" label="Heading 2 bolder" weight="bolder" />
          <Heading type="h2" label="Heading 2 light" weight="light" />
        </styled.Section>
        <styled.Section>
          <Heading type="h3" label="Heading 3 normal" weight="normal" />
          <Heading type="h3" label="Heading 3 bold" />
          <Heading type="h3" label="Heading 3 bolder" weight="bolder" />
          <Heading type="h3" label="Heading 3 light" weight="light" />
        </styled.Section>
        <styled.Section>
          <Heading type="h4" label="Heading 4 normal" weight="normal" />
          <Heading type="h4" label="Heading 4 bold" />
          <Heading type="h4" label="Heading 4 bolder" weight="bolder" />
          <Heading type="h4" label="Heading 4 light" weight="light" />
        </styled.Section>
        <styled.Section>
          <Heading type="h5" label="Heading 5 normal" weight="normal" />
          <Heading type="h5" label="Heading 5 bold" />
          <Heading type="h5" label="Heading 5 bolder" weight="bolder" />
          <Heading type="h5" label="Heading 5 light" weight="light" />
        </styled.Section>

        <styled.Name>
          <Heading label="Components «Input» & «InputDark»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <Input label="Input Name" placeholder="Input ..." />
          <Input label="Input Name" placeholder="Input selected ..." selected />
          <Input label="Input Name" placeholder="Input disabled ..." disabled />
        </styled.SectionGrid3>
        <styled.SectionGrid3>
          <InputDark placeholder="InputDark Primary ..." />
          <InputDark variant="secondary" placeholder="InputDark secondary ..." />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «Loader»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Loader />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Message»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Message type="success">Success message</Message>
          <Message type="danger">Danger message</Message>
          <Message type="info">Info message</Message>
        </styled.Section>

        <styled.Name>
          <Heading label="Component «ProgressBar»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <ProgressBar percent={20} />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «Separator»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Separator />
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Message»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Message type="success">Success message</Message>
          <Message type="danger">Danger message</Message>
          <Message type="info">Info message</Message>
        </styled.Section>

        <styled.Name>
          <Heading label="Component «Text»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Text text="xxxl text" size="xxxl" />
          <Text text="xxl text" size="xxl" />
          <Text text="xl text" size="xl" />
          <Text text="l text" size="l" />
          <Text text="m text" size="m" />
          <Text text="s text" size="s" />
          <Text text="xs text" size="xs" />
          <Text text="xxs text" size="xxs" />
        </styled.Section>
        <styled.Section>
          <Text text="Bold Text" size="xl" weight="bold" />
          <Text text="Bolder Text" size="xl" weight="bolder" />
          <Text text="Light Text" size="xl" weight="light" />
        </styled.Section>
        <styled.SectionGrid2>
          <Text
            text="Multiline text with very long text. Multiline text with very long text. Multiline text with very long text. Multiline text with very long text."
            size="m"
            align="left"
            isMultiline={true}
          />
          <Text
            text="Single line text with very long text. Single line text with very long text. Single line text with very long text. Single line text with very long text."
            size="m"
            isMultiline={false}
          />
        </styled.SectionGrid2>

        <styled.Name>
          <Heading label="Components «TextArea» & «TextAreaDark»" type="h2" align="left" />
        </styled.Name>
        <styled.SectionGrid3>
          <TextArea name="Label" placeholder="Placeholder..." />
          <TextArea name="Label" placeholder="Placeholder selected..." selected />
          <TextArea name="Label" placeholder="Placeholder disabled..." disabled />
        </styled.SectionGrid3>
        <styled.SectionGrid3>
          <TextAreaDark rows={3} />
        </styled.SectionGrid3>

        <styled.Name>
          <Heading label="Component «Tooltip»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <Tooltip label="The Tooltip" placement="bottom" visible>
            <Button variant="danger" size="normal" label="Bottom" />
          </Tooltip>
          <Tooltip label="Music Player" placement="top" visible>
            <Button variant="danger" size="normal" label="Top" />
          </Tooltip>
          <Tooltip label="Information" placement="left" visible>
            <Button variant="danger" size="normal" label="Left" />
          </Tooltip>
          <Tooltip label="Share Location" placement="right" visible>
            <Button variant="primary" size="normal" label="Right" />
          </Tooltip>
        </styled.Section>

        <styled.Name>
          <Heading label="Component «ToolbarIconList»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <ToolbarIconList>
            <ToolbarIcon icon="music" title="Music" />
            <ToolbarIcon icon="wallet" title="Wallet" />
            <ToolbarIcon icon="screenshare" title="Screenshare" />
            <ToolbarIcon icon="leave" title="Leave" />
          </ToolbarIconList>
        </styled.Section>
      </styled.Components>
    </styled.Div>
  );
};

export default AtomsPage;
