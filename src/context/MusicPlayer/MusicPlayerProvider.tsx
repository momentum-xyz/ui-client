import React, {useState, useCallback, useEffect, useRef, useReducer, useMemo} from 'react';
import {Howl, HowlOptions} from 'howler';

import {initialState, reducer, Actions} from './MusicPlayerStateReducer';
import {MusicPlayerContext, MusicPlayerPositionContext} from './MusicPlayerContextManager';
import {MusicPlayerContextInterface} from './MusicPlayerContextType';

export interface MusicPlayerProviderProps {
  children: React.ReactNode;
  value?: MusicPlayerContextInterface;
}

export const MusicPlayerProvider: React.FC<MusicPlayerProviderProps> = ({children, value}) => {
  const [player, setPlayer] = useState<Howl | null>(null);
  const [{loading, error, playing, stopped, duration, ready, ended, show, vol}, dispatch] =
    useReducer(reducer, initialState);
  const playerRef = useRef<Howl>();
  const prevPlayer = useRef<Howl>();
  const [position, setPosition] = useState(0);
  const positionContextValue = useMemo(
    () => ({
      position,
      setPosition
    }),
    [position, setPosition]
  );

  const constructHowl = useCallback((audioProps: HowlOptions): Howl => {
    return new Howl(audioProps);
  }, []);

  const handleMusicPlayer = useCallback((status) => {
    if (!status) {
      dispatch({type: Actions.SHOW_PLAYER});
    } else {
      dispatch({type: Actions.HIDE_PLAYER});
    }
  }, []);

  const load = useCallback(
    ({src, autoplay = false, format, html5 = true, ...rest}: HowlOptions) => {
      let wasPlaying = false;
      // const {volume} = rest

      if (playerRef.current) {
        // don't do anything if we're asked to reload the same source
        // @ts-ignore the _src argument actually exists
        const {_src} = playerRef.current;
        // internal Howl _src property is sometimes an array and other times a single string
        // still need to to do more research on why this is
        const prevSrc = Array.isArray(_src) ? _src[0] : _src;
        if (prevSrc === src) return;
        // if the previous sound is still loading then destroy it as soon as it finishes
        if (loading) {
          prevPlayer.current = playerRef.current;
          prevPlayer.current.once('load', () => {
            prevPlayer.current?.unload();
          });
        }

        wasPlaying = playerRef.current.playing();
        if (wasPlaying) {
          playerRef.current.stop();
          // remove event handlers from player that is about to be replaced
          playerRef.current.off();
          playerRef.current = undefined;
        }
      }
      // signal that the loading process has begun
      dispatch({type: Actions.START_LOAD});

      // create a new player
      const howl = constructHowl({
        src,
        autoplay: wasPlaying || autoplay, // continues playing next song
        html5,
        format,
        ...rest
      });
      // if this howl has already been loaded (cached) then fire the load action
      // @ts-ignore _state exists
      if (howl._state === 'loaded') {
        dispatch({type: Actions.ON_LOAD, duration: howl.duration(), vol: howl.volume()});
      }

      howl.on('load', () =>
        dispatch({
          type: Actions.ON_LOAD,
          duration: howl.duration(),
          vol: howl.volume()
        })
      );

      howl.on('play', () => dispatch({type: Actions.ON_PLAY}));
      howl.on('end', () => dispatch({type: Actions.ON_END}));
      howl.on('pause', () => dispatch({type: Actions.ON_PAUSE}));
      howl.on('stop', () => dispatch({type: Actions.ON_STOP}));
      howl.on('playerror', (_id, error) => {
        dispatch({
          type: Actions.ON_PLAY_ERROR,
          error: new Error('[Play error] ' + error)
        });
      });
      howl.on('loaderror', (_id, error) => {
        dispatch({
          type: Actions.ON_LOAD_ERROR,
          error: new Error('[Load error] ' + error)
        });
      });

      setPlayer(howl);
      playerRef.current = howl;
    },
    [constructHowl, loading]
  );

  useEffect(() => {
    // unload the player on unmount
    return () => {
      if (playerRef.current) playerRef.current.unload();
    };
  }, []);

  const contextValue: MusicPlayerContextInterface = useMemo(() => {
    return value
      ? value
      : {
          player,
          load,
          error,
          loading,
          playing,
          stopped,
          ready,
          duration,
          ended,
          show,
          handleMusicPlayer,
          vol
        };
  }, [
    loading,
    error,
    playing,
    stopped,
    load,
    value,
    player,
    ready,
    duration,
    ended,
    show,
    handleMusicPlayer,
    vol
  ]);

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      <MusicPlayerPositionContext.Provider value={positionContextValue}>
        {children}
      </MusicPlayerPositionContext.Provider>
    </MusicPlayerContext.Provider>
  );
};
