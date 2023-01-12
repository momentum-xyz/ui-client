import React, {useMemo} from 'react';
import {generatePath, useHistory, useLocation} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import DraggableContent from 'react-draggable';
import {useTranslation} from 'react-i18next';
import {Portal, SvgButton, Text} from '@momentum-xyz/ui-kit';
import cn from 'classnames';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {VideoPanel} from 'ui-kit';

import * as styled from './LiveStreamPIPWidget.styled';

const LiveStreamPIPWidget: React.FC = () => {
  const {mainStore, flightStore, agoraStore_OLD} = useStore();
  const {liveStreamStore} = mainStore;

  const history = useHistory();
  const {t} = useTranslation();
  const location = useLocation();

  const isFlightAround = useMemo(() => {
    return !location.pathname.includes(ROUTES.collaboration.root);
  }, [location.pathname]);

  if (!liveStreamStore.isLiveStreamShown || !agoraStore_OLD.spaceId) {
    return null;
  }

  return (
    <Portal>
      <DraggableContent>
        <styled.Container
          data-testid="LiveStreamPIPWidget-test"
          className={cn(!isFlightAround && 'notFlyAround')}
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
              disabled={flightStore.isFlightWithMe}
              onClick={() => {
                history.push(
                  generatePath(ROUTES.collaboration.liveStream, {spaceId: agoraStore_OLD.spaceId})
                );
              }}
              isWhite
            />
            {isFlightAround && (
              <SvgButton
                iconName="collaboration"
                size="medium-large"
                disabled={flightStore.isFlightWithMe}
                onClick={() => {
                  history.push(
                    generatePath(ROUTES.collaboration.dashboard, {spaceId: agoraStore_OLD.spaceId})
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
