import React, {FC, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import ReactHowlerOriginal, {PropTypes as ReactHowlerProps} from 'react-howler';
import {Avatar, ToolbarIcon, ToolbarIconInterface, ToolbarIconList} from '@momentum-xyz/ui-kit';

import {useStore} from 'shared/hooks';
import {switchFullscreen} from 'core/utils';
import {
  HelpWidget,
  MusicPlayerWidget,
  WorldStatsWidget,
  EmojiWidget
} from 'scenes/widgets_OLD/pages';

import * as styled from './Widgets_OLD.styled';

const ReactHowler = ReactHowlerOriginal as unknown as FC<ReactHowlerProps>;

const Widgets_OLD: FC = () => {
  const {sessionStore, widgetStore_OLD, odysseyCreatorStore, unityStore} = useStore();
  const {unityInstanceStore} = unityStore;
  const {worldStatsStore, helpStore, musicPlayerStore, emojiStore} = widgetStore_OLD;
  const {statsDialog} = worldStatsStore;
  const {user, userId} = sessionStore;
  const {musicPlayerWidget, playlist, musicPlayer} = musicPlayerStore;

  const {t} = useTranslation();

  useEffect(() => {
    musicPlayerStore.init(unityStore.worldId);
    emojiStore.init(unityStore.worldId);
    odysseyCreatorStore.fetchPermissions();
  }, [userId, user, unityStore.worldId, musicPlayerStore, emojiStore, odysseyCreatorStore]);

  const mainToolbarIcons: ToolbarIconInterface[] = [
    {title: t('labels.worldStats'), icon: 'stats', onClick: statsDialog.open},
    {
      title: t('labels.calendar'),
      icon: 'calendar'
      // link: location.pathname === '/calendar' ? ROUTES.base : ROUTES.calendar,
    },
    {
      title: t('labels.minimap'),
      icon: 'minimap',
      onClick: () => unityInstanceStore.toggleMiniMap()
    },
    {
      title: t('labels.musicPlayer'),
      icon: 'music',
      onClick: musicPlayerWidget.toggle
    },
    {title: t('labels.help'), icon: 'question', onClick: helpStore.helpDialog.open},
    {title: t('labels.fullscreen'), icon: 'fullscreen', onClick: switchFullscreen}
  ];

  return (
    <>
      {worldStatsStore.statsDialog.isOpen && <WorldStatsWidget />}
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
          <ToolbarIcon
            icon="planet"
            title={t('titles.worldBuilder')}
            //link={ROUTES.worldBuilder.builder}
            size="normal-large"
            isWhite={false}
          />
          )
        </styled.MainLinks>
        <styled.Toolbars>
          {/* Main toolbar icons */}
          <ToolbarIconList>
            {user?.profile && (
              <ToolbarIcon
                title={t('titles.profile')} /*onClick={profileMenuStore.openProfileMenu}*/
              >
                <Avatar
                  size="extra-small"
                  status={user.status}
                  avatarSrc={user.avatarSrc}
                  showBorder
                  showHover
                />
              </ToolbarIcon>
            )}
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
