import React from 'react';
import {generatePath, useHistory} from 'react-router-dom';
import {observer} from 'mobx-react-lite';
import DraggableContent from 'react-draggable';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';
import {Portal, SvgButton, Text} from 'ui-kit';

import * as styled from './LiveStreamPIPWidget.styled';

const Draggable: any = DraggableContent;

interface PropsInterface {
  youtubeHash?: string;
  hideWidget?: () => void;
  showWidget?: boolean;
  flyAround?: boolean;
}

const LiveStreamPIPWidget: React.FC<PropsInterface> = ({
  youtubeHash,
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
        <styled.Container title="" data-testid="LiveStreamPIPWidget-test">
          <styled.VideoWrapper>
            <styled.VideoPanelStyled youtubeHash={youtubeHash} onWidget />
          </styled.VideoWrapper>
          <styled.HeaderElement className="left">
            <Text text={t('liveStream.subtitle')} size="l" weight="bold" />
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
                iconName="fly-to"
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
