import create from 'zustand';

export const useStageModeStore = create<{hasJoined: boolean; isOnStage: boolean}>(() => ({
  hasJoined: false,
  isOnStage: false
}));
