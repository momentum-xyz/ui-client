import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {t} from 'i18next';
import {useNavigate} from 'react-router';
import {Button, SpacePage, SpaceTopBar} from '@momentum-xyz/ui-kit';
import {generatePath} from 'react-router-dom';

import {useStore} from 'shared/hooks';
import {VideoPanel} from 'ui-kit';
import {ROUTES} from 'core/constants';

import * as styled from './LiveStreamPage.styled';

const LiveStreamPage: FC = () => {
  const {liveStreamStore_OLD, collaborationStore} = useStore();
  const {spaceStore} = collaborationStore;
  const {space} = spaceStore;

  const navigate = useNavigate();

  useEffect(() => {
    liveStreamStore_OLD.showWidget();
    liveStreamStore_OLD.enteredLiveStreamTab();

    return () => liveStreamStore_OLD.leftLiveStreamTab();
  }, [liveStreamStore_OLD]);

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
          navigate(ROUTES.base);
        }}
        adminLink={generatePath(ROUTES.spaceAdmin.base, {spaceId: space.id})}
        baseLink={generatePath(ROUTES.base, {spaceId: space.id})}
      >
        {liveStreamStore_OLD.isStreaming && spaceStore.isAdmin && (
          <Button
            label={t('liveStream.stopStream')}
            variant="danger"
            onClick={() => liveStreamStore_OLD.disableBroadcast(space.id)}
          />
        )}
      </SpaceTopBar>
      <styled.Container>
        <VideoPanel youtubeHash={liveStreamStore_OLD.broadcast.url} />
      </styled.Container>
    </SpacePage>
  );
};

export default observer(LiveStreamPage);
