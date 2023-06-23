import {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Frame, SoundPlayer, SoundVolume} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';

import * as styled from './SoundSelector.styled';

const SoundSelector: FC = () => {
  const {widgetStore, universeStore} = useStore();
  const {creatorStore} = widgetStore;
  const {soundSelectorStore} = creatorStore;

  useEffect(() => {
    soundSelectorStore.fetchSound(universeStore.worldId);

    return () => {
      soundSelectorStore.resetModel();
    };
  }, [soundSelectorStore, universeStore]);

  return (
    <styled.Container data-testid="SoundSelector-test">
      <Frame>
        <styled.Head>
          <styled.Title>Odyssey soundtrack</styled.Title>
          <styled.Info>
            Lorem ipsum dolor sit amet, consectetuer adipicing elit. Aenean commodo ligula.
          </styled.Info>

          <styled.UploadBlock>
            <Button wide label="Upload a sound file" icon="sound_add" />
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
            <SoundVolume volumePercent={30} onChangeVolume={(percent) => {}} />
          </styled.TrackBlock>
        </styled.TracksWrapper>
      </styled.TracksContainer>
    </styled.Container>
  );
};

export default observer(SoundSelector);
