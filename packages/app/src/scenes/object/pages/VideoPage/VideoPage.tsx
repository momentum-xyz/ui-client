import React, {FC, useCallback, useState} from 'react';
import {Button, Heading, Input, Loader, SvgButton, Text} from '@momentum-xyz/ui-kit';
import {observer} from 'mobx-react-lite';
import {generatePath, useHistory, useParams} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {ROUTES} from 'core/constants';
import {VideoPanel} from 'ui-kit';
import {ObjectInterface} from 'api';
import {youtubeVideoPath} from 'core/utils';
import {useStore} from 'shared/hooks';

import * as styled from './VideoPage.styled';

interface PropsInterface {
  content?: ObjectInterface;
  worldId: string;
}

const VideoPage: FC<PropsInterface> = ({content, worldId}) => {
  const history = useHistory();
  const {mainStore, objectStore} = useStore();
  const {unityStore} = mainStore;

  const {t} = useTranslation();

  const {objectId} = useParams<{objectId: string}>();

  const [isChangeVideoOpen, setIsChangeVideoOpen] = useState(false);
  const [youtubeSrc, setYoutubeSrc] = useState('');

  const handleFocus = useCallback(() => {
    unityStore.changeKeyboardControl(false);
  }, [unityStore]);

  const handleBlur = useCallback(() => {
    unityStore.changeKeyboardControl(true);
  }, [unityStore]);

  return (
    <styled.Modal data-testid="VideoPage-test">
      {isChangeVideoOpen && (
        <styled.ChangeTextForm>
          <Heading label={t('labels.changeVideo')} type="h2" />
          <Input onFocus={handleFocus} onBlur={handleBlur} onChange={setYoutubeSrc} />
          <Button
            label={t('actions.change')}
            onClick={async () => {
              await objectStore.postNewContent(objectId, {
                youtube_url: youtubeSrc
              });

              setIsChangeVideoOpen(false);
            }}
          />
          <Button
            label={t('actions.cancel')}
            variant="danger"
            onClick={() => {
              setIsChangeVideoOpen(false);
            }}
          />
        </styled.ChangeTextForm>
      )}
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
          <Button label={t('actions.changeVideo')} onClick={() => setIsChangeVideoOpen(true)} />
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
