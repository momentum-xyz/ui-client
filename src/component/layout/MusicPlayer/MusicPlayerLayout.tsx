import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';

import {useStore} from 'shared/hooks';

import {useMusicPlayer} from '../../../context/MusicPlayer/hooks/useMusicPlayer';
import {usePlaylistHash} from '../../../hooks/api/useMusicPlayer';
import {ReactComponent as CloseIcon} from '../../../images/icons/close.svg';

import MusicPlayerController from './MusicPlayerController';
import {MusicSeekBar} from './MusicSeekBar';
import {MusicVolumeController} from './MusicVolumeController';
import {UnityVolumeController} from './UnityVolumeController';

export interface MusicPlayerLayoutProps {}

const MusicPlayerLayout: React.FC<MusicPlayerLayoutProps> = () => {
  const {worldStore} = useStore().mainStore;
  const [playlistHash, , , refetch] = usePlaylistHash(worldStore.worldId);
  const [playlist, setPlaylist] = useState<any[]>([]);
  const {handleMusicPlayer, show} = useMusicPlayer();

  useEffect(() => {
    if (!playlistHash) {
      return;
    }

    const newPlaylist = [] as any;
    // @ts-ignore
    playlistHash.map(({track}) => {
      return newPlaylist.push([track.file_hash, track.name]);
    });
    setPlaylist(Object.values(newPlaylist));
  }, [playlistHash]);

  useEffect(() => {
    if (show) {
      refetch();
    }
  }, [show, refetch, worldStore.worldId]);

  const handleMusicPlayerStatus = () => {
    handleMusicPlayer(!show);
  };

  return (
    <div
      className={`z-overlay bottom-8 right-10 ${show ? '' : 'hidden'} 
        container text-sm text-white-70 font-normal
        px-1 pb-1 pt-.8 rounded pointer-events-all overflow-hidden block
        bg-new-blue-80 backdrop-blur backdrop-filter absolute w-21
        ${playlist.length > 0 ? 'h-21' : ''}`}
    >
      <button
        className="w-1.4 cursor-pointer absolute top-0 right-0 mt-1 mr-1 text-green-light-70"
        onClick={handleMusicPlayerStatus}
      >
        <CloseIcon className="hover:text-green-light-100" />
      </button>

      {playlist.length > 0 && (
        <>
          <MusicPlayerController playlistHash={playlist} />
          <MusicSeekBar />
        </>
      )}
      <div className="mt-2.8">
        {playlist.length > 0 && <MusicVolumeController label="Music Volume" />}
        <UnityVolumeController label="Sounds Effects Volume" />
      </div>
    </div>
  );
};

export default observer(MusicPlayerLayout);
