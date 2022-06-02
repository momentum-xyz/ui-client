import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {Dialog} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './MusicPlayerWidget.styled';
import {
  MusicVolumeController,
  PlayerController,
  SeekBarController,
  UnityVolumeController
} from './components';

const DIALOG_OFFSET_RIGHT = 130;
const DIALOG_OFFSET_BOTTOM = 60;

const MusicPlayerWidget: FC = () => {
  const {
    mainStore: {worldStore},
    widgetStore
  } = useStore();
  const {musicPlayerStore} = widgetStore;
  const {musicPlayerWidget, playlist} = musicPlayerStore;

  useEffect(() => {
    if (musicPlayerWidget.isOpen) {
      playlist.fetchPlaylist(worldStore.worldId);
    }
  }, [musicPlayerWidget.isOpen]);

  return (
    <Dialog
      position="rightBottom"
      headerStyle="uppercase"
      title={playlist.currentTrackName}
      titleWidth="145px"
      headerItem="center"
      headerType="h4"
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={musicPlayerWidget.close}
      showCloseButton
      showBackground={false}
      closeOnBackgroundClick={false}
    >
      <styled.Div>
        <PlayerController />
        <SeekBarController />
        <MusicVolumeController />
        <UnityVolumeController />
      </styled.Div>
    </Dialog>
  );
};

export default observer(MusicPlayerWidget);
