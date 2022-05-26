import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useHistory} from 'react-router';

import {ROUTES} from 'core/constants';
import {useStore} from 'shared/hooks';

import useUnityEvent from '../../context/Unity/hooks/useUnityEvent';
import UnityService from '../../context/Unity/UnityService';
import useWebsocketEvent from '../../context/Websocket/hooks/useWebsocketEvent';
import Button from '../atoms/Button';
import useContextAuth from '../../context/Auth/hooks/useContextAuth';
import {BroadcastStatus} from '../../context/type/Broadcast';
import {ReactComponent as CloseIcon} from '../../images/icons/close.svg';
import {ReactComponent as FullScreenIcon} from '../../images/icons/expand-full.svg';
import {ReactComponent as SpaceRocketIcon} from '../../images/icons/space-rocket-flying.svg';
import {useJoinCollaborationSpaceByAssign} from '../../context/Collaboration/hooks/useCollaboration';

export interface LiveStreamLayerProps {}

export interface LiveStream {
  broadcastStatus: BroadcastStatus;
  url: string;
  users: string[];
  youtubeUrl: string;
  spaceId?: string;
  spaceName?: string;
}

const LiveStreamLayer: React.FC<LiveStreamLayerProps> = () => {
  const {unityStore} = useStore().mainStore;
  const [url, setUrl] = useState<string>();
  const [space, setSpace] = useState<{spaceId: string; spaceName: string}>();
  const [fullscreen, setFullscreen] = useState(false);
  const [stopped, setStopped] = useState(true);
  const [broadcastsState, setBroadcastsState] = useState<LiveStream[] | null>(null);
  const {authState} = useContextAuth();
  const broadcasts: LiveStream[] = [];
  const location = useLocation();
  const history = useHistory();
  const joinMeetingSpace = useJoinCollaborationSpaceByAssign();

  //debug
  // useEffect(() =>{
  //   setUrl('uetFO7y8WPA');
  //   setStopped(false)
  // },[])

  useEffect(() => {
    if (fullscreen && !stopped) {
      unityStore.pause();
    } else if (location.pathname === ROUTES.base) {
      unityStore.resume();
    }
  }, [fullscreen, location.pathname, stopped]);

  useEffect(() => {
    broadcastsState?.forEach((b) => {
      // There is a broadcast available for logged in user
      switch (b.broadcastStatus) {
        case BroadcastStatus.PLAY:
          setSpace({
            spaceId: b.spaceId ? b.spaceId : '',
            spaceName: b.spaceName ? b.spaceName : ''
          });
          setUrl(b.url);
          setStopped(false);
          break;
        case BroadcastStatus.STOP:
          setUrl('');
          setStopped(true);
          break;
      }
    });
  }, [broadcastsState, fullscreen, url]);

  useUnityEvent('ClickEventVideo', () => {
    if (url) {
      setFullscreen(true);
      setStopped(false);
    }
  });

  useWebsocketEvent('broadcast', (broadcast: LiveStream) => {
    broadcast.users.forEach((u) => {
      if (u === authState.subject) {
        broadcasts.push(broadcast);
      }
    });

    setBroadcastsState(broadcasts);
  });

  const flyToSpace = () => {
    if (space?.spaceId) {
      UnityService.teleportToSpace(space?.spaceId);
      history.push(ROUTES.base);

      if (process.env.NODE_ENV === 'development') {
        // @ts-ignore
        joinMeetingSpace(space?.spaceId);
      }
    }
  };

  if (!url && stopped) {
    return null;
  }

  if (url && stopped) {
    return (
      <div
        className="fixed z-pop-over bottom-1.5"
        style={{right: process.env.NODE_ENV === 'development' ? '790px' : '360px'}}
      >
        <Button type="ghost" size="s" onClick={() => setStopped(false)}>
          open livestream
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`fixed z-pop-over shadow-black bg-dark-blue-90 transition-all transform ${
          fullscreen
            ? 'w-3/4 h-3/4 m-auto top-0 left-0 right-0 bottom-0'
            : 'w-30  bottom-7 right-2 translate-x-0 translate-y-0'
        }`}
      >
        <div className="responsive-video">
          <iframe
            title="Livestream"
            src={`https://www.youtube.com/embed/${url as string}?autoplay=1`}
            /* @ts-ignore */
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="fixed flex items-center justify-between gap-1 -top-6 px-1 py-2 right-0 backdrop-filter backdrop-blur bg-gradient-blue-green-20 overflow-hidden w-full rounded-t">
            <div className="text-xl uppercase font-bold truncate">
              {space?.spaceName ? space?.spaceName : 'livestream'}
            </div>
            <div className="flex gap-2">
              {space?.spaceId && (
                <button onClick={() => flyToSpace()} title="Fly to space">
                  <SpaceRocketIcon className="w-2 h-2" title="Fly to space" />
                </button>
              )}
              <button
                onClick={() => setFullscreen(!fullscreen)}
                onMouseDown={(e) => e.preventDefault()}
                title={fullscreen ? 'Minimize' : 'Fullscreen'}
              >
                <FullScreenIcon
                  className="w-2 h-2"
                  title={fullscreen ? 'Minimize' : 'Fullscreen'}
                />
              </button>
              <button onClick={() => setStopped(true)}>
                <CloseIcon className="w-2 h-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveStreamLayer;
