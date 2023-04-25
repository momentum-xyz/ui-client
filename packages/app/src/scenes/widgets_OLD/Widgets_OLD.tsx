import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import ReactHowlerOriginal, {PropTypes as ReactHowlerProps} from 'react-howler';
import {ToolbarIcon, ToolbarIconInterface, ToolbarIconList} from '@momentum-xyz/ui-kit';
import {useI18n} from '@momentum-xyz/core';

import {useStore} from 'shared/hooks';
import {HelpWidget, MusicPlayerWidget, EmojiWidget} from 'scenes/widgets_OLD/pages';

import * as styled from './Widgets_OLD.styled';

const ReactHowler = ReactHowlerOriginal as unknown as FC<ReactHowlerProps>;

const Widgets_OLD: FC = () => {
  const {sessionStore, widgetStore_OLD, creatorStore, universeStore} = useStore();
  const {helpStore, musicPlayerStore, emojiStore} = widgetStore_OLD;
  const {user, userId} = sessionStore;
  const {musicPlayerWidget, playlist, musicPlayer} = musicPlayerStore;

  const {t} = useI18n();

  useEffect(() => {
    musicPlayerStore.init(universeStore.worldId);
    emojiStore.init(universeStore.worldId);
    creatorStore.fetchPermissions();
  }, [userId, user, universeStore.worldId, musicPlayerStore, emojiStore, creatorStore]);

  const mainToolbarIcons: ToolbarIconInterface[] = [
    {
      title: t('labels.musicPlayer'),
      icon: 'music',
      onClick: musicPlayerWidget.toggle
    },
    {title: t('labels.help'), icon: 'question', onClick: helpStore.helpDialog.open}
  ];

  return (
    <>
      {helpStore.helpDialog.isOpen && <HelpWidget />}
      {musicPlayerStore.musicPlayerWidget.isOpen && <MusicPlayerWidget />}
      {emojiStore.selectionDialog.isOpen && (
        <styled.EmojiBar>
          <EmojiWidget onClose={emojiStore.selectionDialog.close} />
        </styled.EmojiBar>
      )}
      <ReactHowler
        src={[playlist.currentTrackHash]}
        onLoad={musicPlayer.startLoading}
        format={['mp3', 'ogg', 'acc', 'webm']}
        onPlay={musicPlayer.startedPlaying}
        onEnd={musicPlayerStore.songEnded}
        playing={musicPlayer.isPlaying}
        preload={true}
        loop={false}
        mute={musicPlayer.muted}
        volume={musicPlayer.volume}
        html5={true}
        {...{ref: (ref: ReactHowlerOriginal) => musicPlayer.setPlayer(ref)}}
      />
      <styled.Footer data-testid="Widgets_OLD-test">
        <styled.MainLinks>
          <ToolbarIcon
            icon="smiley-face"
            title={t('actions.react')}
            onClick={emojiStore.selectionDialog.toggle}
            size="normal-large"
            isWhite={false}
          />
          )
        </styled.MainLinks>
        <styled.Toolbars>
          {/* Main toolbar icons */}
          <ToolbarIconList>
            {mainToolbarIcons.map((item) => (
              <ToolbarIcon key={item.title} {...item} state={{canGoBack: true}} />
            ))}
          </ToolbarIconList>
        </styled.Toolbars>
      </styled.Footer>
    </>
  );
};

export default observer(Widgets_OLD);
