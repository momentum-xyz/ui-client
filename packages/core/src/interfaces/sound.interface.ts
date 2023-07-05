export interface SoundItemInterface {
  name: string;
  render_hash: string;
  isActive?: boolean | null;
}

export interface ObjectSoundInterface {
  tracks: SoundItemInterface[];
  volume: number;
  distance: number;
}
