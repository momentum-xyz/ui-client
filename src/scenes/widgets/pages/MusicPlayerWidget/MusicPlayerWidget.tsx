import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import ReactHowler from 'react-howler';

import {Dialog} from 'ui-kit';
import {useStore} from 'shared/hooks';

import * as styled from './MusicPlayerWidget.styled';
import {
  MusicVolumeController,
  PlayerController,
  SeekBarController,
  UnityVolumeController
} from './components';

const DIALOG_OFFSET_RIGHT = 105;
const DIALOG_OFFSET_BOTTOM = 60;

const MusicPlayerWidget: FC = () => {
  const {musicPlayerStore} = useStore().widgetStore;
  const {
    setPlayer,
    init,
    musicPlayerWidget,
    handleOnLoad,
    handleOnPlay,
    handleOnEnd,
    loop,
    mute,
    volume,
    playing,
    playlistStore
  } = musicPlayerStore;
  const {tracks} = playlistStore;

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.info(tracks[0].name);
  }, [tracks]);

  return (
    <Dialog
      position="rightBottom"
      headerStyle="uppercase"
      title="music"
      titleWidth="145px"
      centerTitle
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={musicPlayerWidget.close}
      showCloseButton
      closeOnBackgroundClick={false}
    >
      <ReactHowler
        src={['sound2.mp3']}
        onLoad={handleOnLoad}
        onPlay={handleOnPlay}
        onEnd={handleOnEnd}
        playing={playing}
        loop={loop}
        mute={mute}
        volume={volume}
        html5={true}
        ref={(ref) => setPlayer(ref)}
      />
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
