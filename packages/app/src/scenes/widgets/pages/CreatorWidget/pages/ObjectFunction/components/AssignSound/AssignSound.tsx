import {FC, useEffect, useRef, useState} from 'react';
import ReactHowler from 'react-howler';
import {observer} from 'mobx-react-lite';
import {useI18n} from '@momentum-xyz/core';
import {Button, Frame, SoundItem} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {MusicFileForm} from 'ui-kit';
import {SoundFormInterface} from 'core/interfaces';
import {MusicPlayerView} from 'scenes/widgets/components';

import * as styled from './AssignSound.styled';

interface PropsInterface {
  objectId: string;
}

const AssignSound: FC<PropsInterface> = ({objectId}) => {
  const {musicStore, widgetStore} = useStore();
  const {creatorStore} = widgetStore;
  const {objectFunctionalityStore} = creatorStore;
  const {objectMusic} = objectFunctionalityStore;
  const {musicPlayer} = objectMusic;

  const [isNewForm, setIsNewForm] = useState(false);
  const playerRef = useRef<ReactHowler>(null);

  const {t} = useI18n();

  useEffect(() => {
    const isWorldMusicPlaying = musicStore.musicPlayer.isPlaying;
    musicStore.musicPlayer.pause();

    return () => {
      if (isWorldMusicPlaying) {
        musicStore.musicPlayer.play();
      }
    };
  }, [musicStore.musicPlayer]);

  useEffect(() => {
    objectMusic.init(objectId);
    objectMusic.subscribe();

    return () => {
      objectMusic.unsubscribe();
      objectMusic.resetModel();
    };
  }, [objectId, objectMusic]);

  useEffect(() => {
    if (playerRef.current) {
      musicPlayer.setPlayer(playerRef.current);
    }
  }, [musicStore, musicPlayer.activeTrack, musicPlayer]);

  const handlePublish = async (form: SoundFormInterface) => {
    if (await objectMusic.publishSpacialSound(form)) {
      setIsNewForm(false);
    }
  };

  const handleDelete = async (hash: string) => {
    await objectMusic.deleteSpacialSound(hash);
  };

  return (
    <styled.Container data-testid="AssignSound-test">
      <Frame>
        <styled.Head>
          <styled.Title>{t('titles.objectSound')}</styled.Title>
          <styled.Message>{t('messages.objectSound')}</styled.Message>

          <styled.UploadBlock>
            {!isNewForm ? (
              <Button
                wide
                icon="sound_add"
                label={t('actions.uploadSoundFile')}
                onClick={() => setIsNewForm(true)}
              />
            ) : (
              <MusicFileForm
                isPending={objectMusic.isUpdating}
                onCancel={() => setIsNewForm(false)}
                onPublish={handlePublish}
              />
            )}
          </styled.UploadBlock>
        </styled.Head>
      </Frame>

      <styled.TracksContainer>
        <styled.Howler>
          {objectMusic.hasActiveTrack && (
            <ReactHowler ref={playerRef} {...musicPlayer.howlerProps} />
          )}
        </styled.Howler>

        {/* ACTIVE TRACK */}
        <MusicPlayerView musicPlayer={musicPlayer} setVolume={objectMusic.updateVolume} />

        {/* TRACK LIST */}
        <styled.TrackList>
          {musicPlayer.trackList.map((track) => (
            <SoundItem
              key={track.hash}
              item={track}
              isActive={musicPlayer.activeTrack?.hash === track.hash}
              onStart={() => musicPlayer.start(track.hash)}
              onStop={musicPlayer.stop}
              onDelete={() => handleDelete(track.hash)}
            />
          ))}
        </styled.TrackList>
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(AssignSound);
