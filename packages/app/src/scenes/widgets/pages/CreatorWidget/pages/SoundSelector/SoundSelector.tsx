import {FC, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, SoundPlayer, SoundVolume} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import {SoundFileForm} from './components';
import * as styled from './SoundSelector.styled';

const SoundSelector: FC = () => {
  const {widgetStore, universeStore} = useStore();
  const {worldId, musicStore} = universeStore;
  const {creatorStore} = widgetStore;
  const {soundSelectorStore} = creatorStore;

  const [isNewForm, setIsNewForm] = useState(false);

  useEffect(() => {
    soundSelectorStore.fetchTracks(worldId);

    return () => {
      soundSelectorStore.resetModel();
    };
  }, [soundSelectorStore, worldId]);

  return (
    <styled.Container data-testid="SoundSelector-test">
      <Frame>
        <styled.Head>
          <styled.Title>Odyssey soundtrack</styled.Title>
          <styled.Info>
            Sound lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.
          </styled.Info>

          <styled.UploadBlock>
            {!isNewForm ? (
              <Button
                wide
                label="Upload a sound file"
                icon="sound_add"
                onClick={() => setIsNewForm(true)}
              />
            ) : (
              <SoundFileForm />
            )}
          </styled.UploadBlock>
        </styled.Head>
      </Frame>

      <styled.TracksContainer>
        <styled.TracksWrapper>
          <styled.TrackBlock>
            <styled.Title>No sound selected</styled.Title>
            <SoundPlayer />
          </styled.TrackBlock>

          <styled.TrackBlock>
            <styled.Title>Volume</styled.Title>
            <SoundVolume volumePercent={musicStore.volume} onChangeVolume={musicStore.setVolume} />
          </styled.TrackBlock>
        </styled.TracksWrapper>
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(SoundSelector);
