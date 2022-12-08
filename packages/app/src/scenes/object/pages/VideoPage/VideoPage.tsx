import React, {FC} from 'react';
import {Loader, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory} from 'react-router-dom';

import {ROUTES} from 'core/constants';
import {VideoPanel} from 'ui-kit';
import {ObjectInterface} from 'api';
import {youtubeVideoPath} from 'core/utils';

import * as styled from './VideoPage.styled';

interface PropsInterface {
  content?: ObjectInterface;
  worldId: string;
}

const VideoPage: FC<PropsInterface> = ({content, worldId}) => {
  const history = useHistory();

  return (
    <styled.Modal data-testid="VideoPage-test">
      <styled.Container>
        <styled.ContentWrapper>
          {content?.youtube_url ? (
            <VideoPanel
              youtubeHash={youtubeVideoPath(content?.youtube_url ?? '', undefined)}
              widgetMode
            />
          ) : (
            <Loader />
          )}
        </styled.ContentWrapper>
        <styled.HeaderElement className="left">
          <styled.Title>
            <Text
              text={content?.title ? content?.title : 'Video'}
              transform="uppercase"
              weight="bold"
              size="xl"
            />
          </styled.Title>
        </styled.HeaderElement>
        <styled.HeaderElement className="right">
          <styled.Button>
            <SvgButton
              iconName="close"
              size="large"
              isWhite
              onClick={() => {
                history.push(generatePath(ROUTES.odyssey.base, {worldId}));
              }}
            />
          </styled.Button>
        </styled.HeaderElement>
      </styled.Container>
    </styled.Modal>
  );
};

export default observer(VideoPage);
