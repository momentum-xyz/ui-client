import React, {FC} from 'react';
import {observer} from 'mobx-react-lite';
import YouTube from 'react-youtube';

import {appVariables} from 'api/constants';
import {Section} from 'scenes/widgets/pages/HelpWidget/components';
import {useStore} from 'shared/hooks';
import {HelpSectionEnum} from 'scenes/widgets/stores/HelpStore';

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
    helpStore.toggleSection(HelpSectionEnum.IntroVideo);
  };

  return (
    <Section
      name="Intro Video"
      icon="screenshare"
      expanded={helpStore.showIntroVideoSection}
      onExpandToggle={handleExpand}
      withBorder={false}
    >
      <styled.VideoWrapper data-testid="IntroVideo-test">
        <YouTube videoId={appVariables.YOUTUBE_WELCOME_VIDEO_ID} opts={opts} />
      </styled.VideoWrapper>
    </Section>
  );
};

export default observer(IntroVideo);
