import {FC} from 'react';
import {observer} from 'mobx-react-lite';

const MusicPlayerWidget: FC = () => {
  /*const {universeStore, widgetStore_OLD} = useStore();
  const {musicPlayerStore} = widgetStore_OLD;
  const {musicPlayerWidget, playlist} = musicPlayerStore;

  useEffect(() => {
    playlist.fetchPlaylist(universeStore.worldId);
  }, [musicPlayerWidget.isOpen, playlist, universeStore.worldId]);

  return (
    <Dialog
      position="rightBottom"
      headerStyle="uppercase"
      title={playlist.currentTrackName || ' '}
      titleWidth="150px"
      headerItem="left"
      headerType="h4"
      isTruncateHeader
      offset={{right: DIALOG_OFFSET_RIGHT, bottom: DIALOG_OFFSET_BOTTOM}}
      onClose={musicPlayerWidget.close}
      showCloseButton
      showBackground={false}
    >
      <styled.Div data-testid="MusicPlayerWidget-test">
        {playlist.songsExist && (
          <>
            <PlayerController />
            <SeekBarController />
            <MusicVolumeController />
          </>
        )}
        <UnityVolumeController />
      </styled.Div>
    </Dialog>
  );*/

  return <></>;
};

export default observer(MusicPlayerWidget);
