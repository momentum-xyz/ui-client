import React from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import DraggableContent from 'react-draggable';
import {useTranslation} from 'react-i18next';
import {Portal, SvgButton, Text} from '@momentum-xyz/ui-kit';
import cn from 'classnames';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {VideoPanel} from 'ui-kit';

import * as styled from './LiveStreamPIPWidget.styled';

interface PropsInterface {
  flyAround?: boolean;
}

const LiveStreamPIPWidget: React.FC<PropsInterface> = ({flyAround}) => {
  const {mainStore} = useStore();
  const {agoraStore, liveStreamStore} = mainStore;
  const history = useHistory();
  const {t} = useTranslation();

  if (!liveStreamStore.isLiveStreamShown || !agoraStore.spaceId) {
    return null;
  }

  return (
    <Portal>
      <DraggableContent>
        <styled.Container
          data-testid="LiveStreamPIPWidget-test"
          className={cn(!flyAround && 'notFlyAround')}
        >
          <styled.VideoWrapper>
            <VideoPanel youtubeHash={liveStreamStore.broadcast.url} widgetMode />
          </styled.VideoWrapper>
          <styled.HeaderElement className="left">
            <styled.Title>
              <Text
                text={liveStreamStore.spaceName}
                transform="uppercase"
                weight="bold"
                size="l"
                isMultiline={false}
              />
            </styled.Title>
            <styled.SubTitle>
              <Text
                text={`/ ${t('liveStream.subtitle')}`}
                transform="uppercase"
                size="l"
                isMultiline={false}
              />
            </styled.SubTitle>
          </styled.HeaderElement>
          <styled.HeaderElement className="right">
            <SvgButton
              iconName="fullscreen"
              size="medium"
              onClick={() => {
                history.push(
                  generatePath(ROUTES.collaboration.liveStream, {spaceId: agoraStore.spaceId})
                );
              }}
              isWhite
            />
            {flyAround && (
              <SvgButton
                iconName="collaboration"
                size="medium-large"
                onClick={() => {
                  history.push(
                    generatePath(ROUTES.collaboration.dashboard, {spaceId: agoraStore.spaceId})
                  );
                }}
                isWhite
              />
            )}
            <SvgButton
              iconName="close"
              size="medium"
              isWhite
              onClick={liveStreamStore.hideWidget}
            />
          </styled.HeaderElement>
        </styled.Container>
      </DraggableContent>
    </Portal>
  );
};

export default observer(LiveStreamPIPWidget);
