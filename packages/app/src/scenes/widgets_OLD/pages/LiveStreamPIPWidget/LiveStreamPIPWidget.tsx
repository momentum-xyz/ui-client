import React, {useMemo} from 'react';
import {generatePath, useNavigate, useLocation} from 'react-router-dom';
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
  const {liveStreamStore_OLD, flightStore, agoraStore_OLD} = useStore();

  const navigate = useNavigate();
  const {t} = useTranslation();
  const location = useLocation();

  const isFlightAround = useMemo(() => {
    return !location.pathname.includes(ROUTES.collaboration.root);
  }, [location.pathname]);

  if (!liveStreamStore_OLD.isLiveStreamShown || !agoraStore_OLD.spaceId) {
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
            <VideoPanel youtubeHash={liveStreamStore_OLD.broadcast.url} widgetMode />
          </styled.VideoWrapper>
          <styled.HeaderElement className="left">
            <styled.Title>
              <Text
                text={liveStreamStore_OLD.spaceName}
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
                navigate(
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
                  navigate(
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
              onClick={liveStreamStore_OLD.hideWidget}
            />
          </styled.HeaderElement>
        </styled.Container>
      </DraggableContent>
    </Portal>
  );
};

export default observer(LiveStreamPIPWidget);
