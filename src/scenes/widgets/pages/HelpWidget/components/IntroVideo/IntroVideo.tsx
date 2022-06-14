import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';

import {appVariables} from 'api/constants';
import {Section} from 'scenes/widgets/pages/HelpWidget/components';
import {useStore} from 'shared/hooks';
import {HelpSectionType} from 'scenes/widgets/stores/HelpStore';

import * as styled from './IntroVideo.styled';

const IntroVideo: FC = () => {
  const {helpStore} = useStore().widgetStore;

  const opts = {
    playerVars: {
      autoplay: 0,
      mute: 0
    }
  };

  const handleExpand = () => {
    helpStore.toggleSection(HelpSectionType.IntroVideo);
  };

  return (
    <Section
      name="Intro Video"
      icon="screenshare"
      expanded={helpStore.showIntroVideoSection}
      onExpandToggle={handleExpand}
    >
      <styled.Video videoId={appVariables.YOUTUBE_INTRO_VIDEO_ID} opts={opts} />
    </Section>
  );
};

export default observer(IntroVideo);
