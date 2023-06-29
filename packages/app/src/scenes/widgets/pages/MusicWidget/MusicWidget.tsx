import {FC} from 'react';
import {observer} from 'mobx-react-lite';
import {Frame, Panel, SoundItem} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {WidgetEnum} from 'core/enums';
import {MusicPlayerView} from 'scenes/widgets/components';

import * as styled from './MusicWidget.styled';

const MusicWidget: FC = () => {
  const {musicStore, widgetManagerStore} = useStore();

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
        <Frame>
          <styled.Head>
            <styled.Title>{t('titles.odysseySoundtrack')}</styled.Title>
            <styled.Message>{t('messages.odysseySoundtrack')}</styled.Message>
          </styled.Head>
        </Frame>

        <styled.TracksContainer>
          {/* ACTIVE TRACK */}
          <MusicPlayerView />

          {/* TRACK LIST */}
          <styled.TrackList>
            {musicStore.trackList.map((track) => (
              <SoundItem
                key={track.hash}
                item={track}
                isActive={musicStore.activeTrack?.hash === track.hash}
                onStart={() => musicStore.start(track.hash)}
                onStop={musicStore.stop}
              />
            ))}
          </styled.TrackList>
        </styled.TracksContainer>
      </Panel>
    </styled.Container>
  );
};

export default observer(MusicWidget);
