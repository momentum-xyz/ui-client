import {FC, useEffect, useRef} from 'react';
import {observer} from 'mobx-react-lite';
import ReactHowler from 'react-howler';

import {useStore} from 'shared/hooks';

import * as styled from './MusicPlayer.styled';

const MusicPlayer: FC = () => {
  const {musicStore} = useStore();

  const playerRef = useRef<ReactHowler>(null);

  useEffect(() => {
    if (playerRef.current) {
      musicStore.setPlayer(playerRef.current);
    }
  }, [musicStore, musicStore.activeTrack]);

  return (
    <styled.Container>
      {musicStore.activeTrack && <ReactHowler ref={playerRef} {...musicStore.howlerProps} />}
    </styled.Container>
  );
};

export default observer(MusicPlayer);
