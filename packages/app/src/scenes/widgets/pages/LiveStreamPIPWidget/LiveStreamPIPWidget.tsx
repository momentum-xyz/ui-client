import React from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import DraggableContent from 'react-draggable';
import {useTranslation} from 'react-i18next';
import {Portal, SvgButton, Text} from '@momentum/ui-kit';
import cn from 'classnames';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {VideoPanel} from 'ui-kit';

import * as styled from './LiveStreamPIPWidget.styled';

const Draggable: any = DraggableContent;

interface PropsInterface {
  youtubeHash?: string;
  spaceName?: string;
  hideWidget?: () => void;
  showWidget?: boolean;
  flyAround?: boolean;
}

const LiveStreamPIPWidget: React.FC<PropsInterface> = ({
  youtubeHash,
  spaceName,
  hideWidget,
  showWidget,
  flyAround
}) => {
  const {mainStore} = useStore();
  const {agoraStore} = mainStore;
  const history = useHistory();
  const {t} = useTranslation();

  if (!youtubeHash || !agoraStore.spaceId || !showWidget) {
    return null;
  }

  return (
    <Portal>
      <Draggable>
        <styled.Container
          data-testid="LiveStreamPIPWidget-test"
          className={cn(!flyAround && 'notFlyAround')}
        >
          <styled.VideoWrapper>
            <VideoPanel youtubeHash={youtubeHash} onWidget />
          </styled.VideoWrapper>
          <styled.HeaderElement className="left">
            <styled.Title>
              <Text
                text={spaceName}
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
            <SvgButton iconName="close" size="medium" isWhite onClick={hideWidget} />
          </styled.HeaderElement>
        </styled.Container>
      </Draggable>
    </Portal>
  );
};

export default observer(LiveStreamPIPWidget);
