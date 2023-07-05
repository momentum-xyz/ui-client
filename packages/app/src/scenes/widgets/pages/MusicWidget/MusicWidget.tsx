import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Panel, SoundItem} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {MusicPlayerView} from 'scenes/widgets/components';

import * as styled from './MusicWidget.styled';

const MusicWidget: FC = () => {
  const {musicStore, widgetManagerStore} = useStore();
  const {musicPlayer} = musicStore;

  const {t} = useI18n();

  return (
    <styled.Container data-testid="MusicWidget-test">
      <Panel
        size="normal"
        isFullHeight
        variant="primary"
        icon="music"
        title={t('labels.sound')}
        onClose={() => widgetManagerStore.close(WidgetEnum.MUSIC)}
      >
        <styled.TracksContainer>
          {/* ACTIVE TRACK */}
          <MusicPlayerView musicPlayer={musicStore.musicPlayer} setVolume={musicStore.setVolume} />

          {/* TRACK LIST */}
          <styled.TrackList>
            {musicPlayer.trackList.map((track) => (
              <SoundItem
                key={track.hash}
                item={track}
                isActive={musicPlayer.activeTrack?.hash === track.hash}
                onStart={() => musicPlayer.start(track.hash)}
                onStop={musicPlayer.stop}
              />
            ))}
          </styled.TrackList>
        </styled.TracksContainer>
      </Panel>
    </styled.Container>
  );
};

export default observer(MusicWidget);
