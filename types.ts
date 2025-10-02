import { File } from 'buffer';

export interface Song {
  id: string;
  // fileUrl has been removed. The URL will be generated just-in-time.
  file: File;      // The actual file data stored in IndexedDB
  title: string;
  artist: string;
  album: string;
  artwork: string | null;
  playCount: number;
  duration: number;
  dateAdded: number;
  isFavorite: boolean;
}

export enum RepeatMode {
  OFF,
  ONE,
  ALL,
}