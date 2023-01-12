import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Dialog} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './MusicPlayerWidget.styled';
import {
  MusicVolumeController,
  PlayerController,
  SeekBarController,
  UnityVolumeController
} from './components';

const DIALOG_OFFSET_RIGHT = 10;
const DIALOG_OFFSET_BOTTOM = 60;

const MusicPlayerWidget: FC = () => {
  const {unityStore, widgetStore_OLD} = useStore();
  const {unityWorldStore} = unityStore;
  const {musicPlayerStore} = widgetStore_OLD;
  const {musicPlayerWidget, playlist} = musicPlayerStore;

  useEffect(() => {
    playlist.fetchPlaylist(unityWorldStore.worldId);
  }, [musicPlayerWidget.isOpen, playlist, unityWorldStore.worldId]);

  return (
    <Dialog
      position="rightBottom"
      headerStyle="uppercase"
      title={playlist.currentTrackName || ' '}
      titleWidth="150px"
      headerItem="left"
      headerType="h4"
      isTruncateHeader
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={musicPlayerWidget.close}
      showCloseButton
      showBackground={false}
    >
      <styled.Div data-testid="MusicPlayerWidget-test">
        {playlist.songsExist && (
          <>
            <PlayerController />
            <SeekBarController />
            <MusicVolumeController />
          </>
        )}
        <UnityVolumeController />
      </styled.Div>
    </Dialog>
  );
};

export default observer(MusicPlayerWidget);
