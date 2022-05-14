import create from 'zustand';

export const useUnityStore = create<{muted: boolean}>(() => ({
  muted: localStorage.getItem('bg-sound-muted') === '1' ? true : false
}));
