import {useCallback, useContext, useEffect, useRef} from 'react';
import {Howl} from 'howler';

import {MusicPlayerContext, MusicPlayerPositionContext} from '../MusicPlayerContextManager';

import useIsomorphicLayoutEffect from './useIsomorphicLayout';

interface UseAudioPositionConfig {
  highRefreshRate?: boolean;
}

interface AudioPosition {
  position: number;
  duration: number;
  seek: (position: number) => number;
}

export const useMusicPosition = (config: UseAudioPositionConfig = {}): AudioPosition => {
  const {highRefreshRate = false} = config;
  const {player, playing, stopped, duration} = useContext(MusicPlayerContext);
  const {position, setPosition} = useContext(MusicPlayerPositionContext);

  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (player) {
      setPosition(player.seek());
    }
  }, [player, setPosition, stopped]);

  useEffect(() => {
    let timeout: number;
    if (!highRefreshRate && player && playing) {
      timeout = window.setInterval(() => setPosition(player.seek()), 1000);
    }
    return () => clearTimeout(timeout);
  }, [highRefreshRate, player, playing, setPosition]);

  useIsomorphicLayoutEffect(() => {
    const animate = () => {
      setPosition(player?.seek() as number);
      animationFrameRef.current = requestAnimationFrame(animate);
      // animationFrameRef.current = raf(animate);
    };

    // kick off a new animation cycle when the player is defined and starts playing
    if (highRefreshRate && player && playing) {
      animationFrameRef.current = requestAnimationFrame(animate);
      // animationFrameRef.current = raf(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        // raf.cancel(animationFrameRef.current);
      }
    };
  }, [highRefreshRate, player, playing, setPosition]);

  const seek = useCallback(
    (position) => {
      if (!player) {
        return 0;
      }

      // it appears that howler returns the Howl object when seek is given a position
      // to get the latest potion you must call seek again with no parameters
      const result = player.seek(position) as unknown as Howl;
      const updatedPos = result.seek();
      setPosition(updatedPos);
      return updatedPos;
    },
    [player, setPosition]
  );

  return {position, duration, seek};
};
