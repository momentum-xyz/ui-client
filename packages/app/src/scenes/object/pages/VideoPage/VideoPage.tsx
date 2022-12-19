import React, {FC} from 'react';
import {Button, Loader, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {VideoPanel} from 'ui-kit';
import {youtubeVideoPath} from 'core/utils';
import {useStore} from 'shared/hooks';
import {ChangeVideoDialog} from 'scenes/object/components';

import * as styled from './VideoPage.styled';

const VideoPage: FC = () => {
  const history = useHistory();
  const {objectStore} = useStore();
  const {tileStore} = objectStore;
  const {changeTileDialog, content} = tileStore;

  const {worldId} = useParams<{worldId: string}>();

  const {t} = useTranslation();

  return (
    <styled.Modal data-testid="VideoPage-test">
      {changeTileDialog.isOpen && <ChangeVideoDialog />}
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
              text={content?.title ? content?.title : t('labels.video')}
              transform="uppercase"
              weight="bold"
              size="xl"
            />
          </styled.Title>
        </styled.HeaderElement>
        <styled.HeaderElement className="button">
          <Button label={t('actions.changeVideo')} onClick={changeTileDialog.open} />
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
