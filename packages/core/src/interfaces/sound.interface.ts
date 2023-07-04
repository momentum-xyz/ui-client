export interface SoundItemInterface {
  name: string;
  render_hash: string;
  hash_url?: string | null;
}

export interface ObjectSoundInterface {
  tracks: SoundItemInterface[];
  volume: number;
  distance: number;
}