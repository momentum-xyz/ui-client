import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useHistory} from 'react-router';
import {Button, SpacePage, SpaceTopBar} from '@momentum-xyz/ui-kit';
import {generatePath} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {VideoPanel} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './LiveStreamPage.styled';

const LiveStreamPage: FC = () => {
  const {mainStore, collaborationStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {liveStreamStore} = mainStore;
  const {space} = spaceStore;

  const history = useHistory();

  useEffect(() => {
    liveStreamStore.showWidget();
    liveStreamStore.enteredLiveStreamTab();

    return () => liveStreamStore.leftLiveStreamTab();
  }, [liveStreamStore]);

  if (!space) {
    return null;
  }

  return (
    <SpacePage dataTestId="LiveStreamPage-test" withMeeting>
      <SpaceTopBar
        title={space.name}
        subtitle={t('liveStream.subtitle')}
        isAdmin={spaceStore.isAdmin}
        spaceId={space.id}
        isSpaceFavorite={false}
        toggleIsSpaceFavorite={() => {}}
        editSpaceHidden
        isChatOpen={false}
        toggleChat={() => {}}
        numberOfUnreadMessages={0}
        onLeave={async () => {
          //await leaveMeetingSpace();
          history.push(ROUTES.base);
        }}
        adminLink={generatePath(ROUTES.spaceAdmin.base, {spaceId: space.id})}
        baseLink={generatePath(ROUTES.base, {spaceId: space.id})}
      >
        {liveStreamStore.isStreaming && spaceStore.isAdmin && (
          <Button
            label={t('liveStream.stopStream')}
            variant="danger"
            onClick={() => liveStreamStore.disableBroadcast(space.id)}
          />
        )}
      </SpaceTopBar>
      <styled.Container>
        <VideoPanel youtubeHash={liveStreamStore.broadcast.url} />
      </styled.Container>
    </SpacePage>
  );
};

export default observer(LiveStreamPage);
