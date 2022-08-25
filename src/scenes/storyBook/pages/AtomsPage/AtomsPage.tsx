import React, {FC} from 'react';
import {useTheme} from 'styled-components';

import {Heading, IconSvg, PageTopBar, SvgButton} from 'ui-kit';

import * as styled from './AtomsPage.styled';

const AtomsPage: FC = () => {
  const theme = useTheme();

  return (
    <styled.Div>
      <PageTopBar title="Momentum «ui-kit»" subtitle="Atoms" />
      <styled.Components>
        <styled.Name>
          <Heading theme={theme} label="Component «IconSvg»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <IconSvg theme={theme} size="large" name="add" />
          <IconSvg theme={theme} size="large" name="add" />
          <IconSvg theme={theme} size="large" name="airport-signal" />
          <IconSvg theme={theme} size="large" name="alert" />
          <IconSvg theme={theme} size="large" name="approved" />
          <IconSvg theme={theme} size="large" name="arrow-keys" />
          <IconSvg theme={theme} size="large" name="arrow" />
          <IconSvg theme={theme} size="large" name="astro" />
          <IconSvg theme={theme} size="large" name="bell" />
          <IconSvg theme={theme} size="large" name="bellRed" />
          <IconSvg theme={theme} size="large" name="bin" />
          <IconSvg theme={theme} size="large" name="calendar" />
          <IconSvg theme={theme} size="large" name="calendarMinus" />
          <IconSvg theme={theme} size="large" name="cameraOff" />
          <IconSvg theme={theme} size="large" name="cameraOn" />
          <IconSvg theme={theme} size="large" name="chart" />
          <IconSvg theme={theme} size="large" name="chat" />
          <IconSvg theme={theme} size="large" name="check-on" />
          <IconSvg theme={theme} size="large" name="check" />
          <IconSvg theme={theme} size="large" name="checkmark" />
          <IconSvg theme={theme} size="large" name="chevron" />
          <IconSvg theme={theme} size="large" name="clock" />
          <IconSvg theme={theme} size="large" name="close" />
          <IconSvg theme={theme} size="large" name="collaboration" />
          <IconSvg theme={theme} size="large" name="controls" />
          <IconSvg theme={theme} size="large" name="copy" />
          <IconSvg theme={theme} size="large" name="cube" />
          <IconSvg theme={theme} size="large" name="denied" />
          <IconSvg theme={theme} size="large" name="direction-arrows" />
          <IconSvg theme={theme} size="large" name="discord" />
          <IconSvg theme={theme} size="large" name="drive" />
          <IconSvg theme={theme} size="large" name="edit" />
          <IconSvg theme={theme} size="large" name="email" />
          <IconSvg theme={theme} size="large" name="exit" />
          <IconSvg theme={theme} size="large" name="explore" />
          <IconSvg theme={theme} size="large" name="fly-to" />
          <IconSvg theme={theme} size="large" name="fullscreen" />
          <IconSvg theme={theme} size="large" name="gear" />
          <IconSvg theme={theme} size="large" name="group" />
          <IconSvg theme={theme} size="large" name="groupChat" />
          <IconSvg theme={theme} size="large" name="hand" />
          <IconSvg theme={theme} size="large" name="home" />
          <IconSvg theme={theme} size="large" name="info" />
          <IconSvg theme={theme} size="large" name="invite-user" />
          <IconSvg theme={theme} size="large" name="kusama" />
          <IconSvg theme={theme} size="large" name="leave" />
          <IconSvg theme={theme} size="large" name="lightbulb" />
          <IconSvg theme={theme} size="large" name="lightningDuotone" />
          <IconSvg theme={theme} size="large" name="lightningOutline" />
          <IconSvg theme={theme} size="large" name="link" />
          <IconSvg theme={theme} size="large" name="live" />
          <IconSvg theme={theme} size="large" name="locate" />
          <IconSvg theme={theme} size="large" name="location" />
          <IconSvg theme={theme} size="large" name="lock" />
          <IconSvg theme={theme} size="large" name="logout" />
          <IconSvg theme={theme} size="large" name="meeting" />
          <IconSvg theme={theme} size="large" name="microphoneOff" />
          <IconSvg theme={theme} size="large" name="microphoneOn" />
          <IconSvg theme={theme} size="large" name="minimap" />
          <IconSvg theme={theme} size="large" name="miro" />
          <IconSvg theme={theme} size="large" name="mouse-pad" />
          <IconSvg theme={theme} size="large" name="music" />
          <IconSvg theme={theme} size="large" name="notes" />
          <IconSvg theme={theme} size="large" name="pencil" />
          <IconSvg theme={theme} size="large" name="people" />
          <IconSvg theme={theme} size="large" name="planet" />
          <IconSvg theme={theme} size="large" name="play-button" />
          <IconSvg theme={theme} size="large" name="player-backward" />
          <IconSvg theme={theme} size="large" name="player-forward" />
          <IconSvg theme={theme} size="large" name="player-mute" />
          <IconSvg theme={theme} size="large" name="player-pause" />
          <IconSvg theme={theme} size="large" name="player-unmute" />
          <IconSvg theme={theme} size="large" name="polkadotprofile" />
          <IconSvg theme={theme} size="large" name="profile" />
          <IconSvg theme={theme} size="large" name="question" />
          <IconSvg theme={theme} size="large" name="questions" />
          <IconSvg theme={theme} size="large" name="qweasd" />
          <IconSvg theme={theme} size="large" name="remove-user" />
          <IconSvg theme={theme} size="large" name="requested" />
          <IconSvg theme={theme} size="large" name="rocket" />
          <IconSvg theme={theme} size="large" name="screenshare" />
          <IconSvg theme={theme} size="large" name="search" />
          <IconSvg theme={theme} size="large" name="shieldCheck" />
          <IconSvg theme={theme} size="large" name="shift-button" />
          <IconSvg theme={theme} size="large" name="sort" />
          <IconSvg theme={theme} size="large" name="sortOnAsc" />
          <IconSvg theme={theme} size="large" name="sortOnDesc" />
          <IconSvg theme={theme} size="large" name="space-bar" />
          <IconSvg theme={theme} size="large" name="stage" />
          <IconSvg theme={theme} size="large" name="star" />
          <IconSvg theme={theme} size="large" name="starOn" />
          <IconSvg theme={theme} size="large" name="stats" />
          <IconSvg theme={theme} size="large" name="stop" />
          <IconSvg theme={theme} size="large" name="tiles" />
          <IconSvg theme={theme} size="large" name="trash" />
          <IconSvg theme={theme} size="large" name="unity" />
          <IconSvg theme={theme} size="large" name="vibe" />
          <IconSvg theme={theme} size="large" name="wallet" />
          <IconSvg theme={theme} size="large" name="warning" />
          <IconSvg theme={theme} size="large" name="whitelist" />
        </styled.Section>

        <styled.Name>
          <Heading theme={theme} label="Component «SvgButton»" type="h2" align="left" />
        </styled.Name>
        <styled.Section>
          <SvgButton theme={theme} iconName="close" size="extra-large" onClick={() => {}} />
          <SvgButton theme={theme} iconName="close" size="large" onClick={() => {}} />
          <SvgButton theme={theme} iconName="close" size="normal" onClick={() => {}} />
          <SvgButton theme={theme} iconName="close" size="small" onClick={() => {}} />
        </styled.Section>
      </styled.Components>
    </styled.Div>
  );
};

export default AtomsPage;
