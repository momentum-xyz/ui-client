import React, {FC} from 'react';
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
  const {musicPlayerStore} = useStore().widgetStore;
  const {musicPlayerWidget, playlistStore} = musicPlayerStore;
  const {currentTrackName} = playlistStore;

  return (
    <Dialog
      position="rightBottom"
      headerStyle="uppercase"
      title={currentTrackName}
      titleWidth="145px"
      headerItem="center"
      headerWeight="h4"
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
