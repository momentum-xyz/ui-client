import React from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import DraggableContent from 'react-draggable';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {IconSvg, Portal, SvgButton, VideoPanel} from 'ui-kit';

import * as styled from './LiveStreamPIPWidget.styled';

const Draggable: any = DraggableContent;

interface PropsInterface {
  youtubeHash?: string;
}

const LiveStreamPIPWidget: React.FC<PropsInterface> = ({youtubeHash}) => {
  const {mainStore} = useStore();
  const {agoraStore} = mainStore;
  const history = useHistory();

  if (!youtubeHash || !agoraStore.spaceId) {
    return null;
  }

  return (
    <Portal>
      <Draggable>
        <styled.Container title="" data-testid="LiveStreamPIPWidget-test">
          <VideoPanel youtubeHash={youtubeHash} />
          <styled.HeaderElement className="left">
            <SvgButton iconName="direction-arrows" size="large" isWhite />
          </styled.HeaderElement>
          <styled.HeaderElement
            className="right"
            onClick={() => {
              history.push(
                generatePath(ROUTES.collaboration.liveStream, {spaceId: agoraStore.spaceId})
              );
            }}
          >
            <IconSvg name="fullscreen" size="large" />
          </styled.HeaderElement>
        </styled.Container>
      </Draggable>
    </Portal>
  );
};

export default observer(LiveStreamPIPWidget);
