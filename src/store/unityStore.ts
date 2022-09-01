import create from 'zustand';

export const useUnityStore = create<{muted: boolean}>(() => ({
  muted: true
}));
